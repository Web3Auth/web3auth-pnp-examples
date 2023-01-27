import type {SafeEventEmitterProvider} from "@web3auth/base";
import {bcs, encoding, providers, utils} from '@starcoin/starcoin'
import {arrayify, hexlify} from '@ethersproject/bytes';

const {account, tx} = utils;
const {JsonRpcProvider} = providers;
const {bcsEncode, decodeReceiptIdentifier} = encoding;
const {encodeScriptFunction, generateRawUserTransaction, signRawUserTransaction, encodeStructTypeTags} = tx
const {BcsSerializer} = bcs;

export default class StcRpc {
    NODE_URL = "https://main-seed.starcoin.org/";
    FAUCET_URL = "https://faucet.starcoin.org/barnard";
    private provider: SafeEventEmitterProvider;

    constructor(provider: SafeEventEmitterProvider) {
        this.provider = provider;
    }

    async getPrivateKey(): Promise<any> {
        try {
            const privateKey = await this.provider.request({
                method: "private_key",
            });
            return privateKey;
        } catch (error) {
            return error as string;
        }
    }

    async getStcAccount(): Promise<any> {
        try {
            const privateKey = await this.getPrivateKey();
            //@ts-ignore
            const stcAccount = new account.showAccount(privateKey);
            return stcAccount;
        } catch (error) {
            return error;
        }
    }

    async getAccounts(): Promise<any> {
        try {
            const stcAccount = await this.getStcAccount();
            return stcAccount.address;
        } catch (error) {
            return error;
        }
    }

    async getAirdrop(): Promise<any> {
        return `Please go to this site ${this.FAUCET_URL}`
    }

    async getBalance(): Promise<any> {
        try {
            const stcAccount = await this.getStcAccount();
            const client = new JsonRpcProvider(this.NODE_URL);
            let balance = await client.getBalance(stcAccount.address);
            // @ts-ignore
            return parseInt(balance) / 1e9;
        } catch (error) {
            return error as string;
        }
    }

    async sendTransaction(): Promise<any> {
        try {
            const receiver = '0xca5ad1ad0aa709b5e04e6763b0987920'
            const stcAccount = await this.getStcAccount();
            const provider = new JsonRpcProvider(this.NODE_URL);
            const senderSequenceNumber = await provider.getSequenceNumber(
                stcAccount.address
            );
            const amount = 1024;
            // Step 1-1: generate payload hex of ScriptFunction
            let receiverAddressHex
            let receiverAuthKeyHex
            let receiverAuthKeyBytes
            if (receiver.slice(0, 3) === 'stc') {
                const receiptIdentifierView = decodeReceiptIdentifier(receiver)
                receiverAddressHex = receiptIdentifierView.accountAddress
                receiverAuthKeyHex = receiptIdentifierView.authKey
                if (receiverAuthKeyHex) {
                    receiverAuthKeyBytes = Buffer.from(receiverAuthKeyHex, 'hex')
                } else {
                    receiverAuthKeyBytes = Buffer.from('00', 'hex')
                }
            } else {
                receiverAddressHex = receiver
                receiverAuthKeyBytes = Buffer.from('00', 'hex')
            }

            // const sendAmountString = `${ amount.toString() }u128`
            // const txnRequest = {
            //   chain_id: chainId,
            //   gas_unit_price: 1,
            //   sender: account.address,
            //   sender_public_key: senderPublicKeyHex,
            //   sequence_number: senderSequenceNumber,
            //   max_gas_amount: 10000000,
            //   script: {
            //     code: '0x1::TransferScripts::peer_to_peer',
            //     type_args: ['0x1::STC::STC'],
            //     args: [receiverAddressHex, `x"${ receiverAuthKeyHex }"`, sendAmountString],
            //   },
            // }
            // const txnOutput = await provider.dryRun(txnRequest)

            // TODO: generate maxGasAmount from contract.dry_run -> gas_used
            let maxGasAmount = BigInt(10000000);
            const gasUnitPrice = 1;
            // because the time system in dev network is relatively static,
            // we should use nodeInfo.now_secondsinstead of using new Date().getTime()
            const nowSeconds = await provider.getNowSeconds();
            // expired after 12 hours since Unix Epoch
            const expiredSecs = 43200
            const expirationTimestampSecs = nowSeconds + expiredSecs

            const functionId = '0x1::TransferScripts::peer_to_peer'

            const strTypeArgs = ['0x1::STC::STC']
            const tyArgs = encodeStructTypeTags(strTypeArgs)

            // Multiple BcsSerializers should be used in different closures, otherwise, the latter will be contaminated by the former.
            const amountSCSHex = (function () {
                const se = new BcsSerializer();
                se.serializeU128(BigInt(amount));
                return hexlify(se.getBytes());
            })();

            const args = [
                arrayify(receiverAddressHex),
                receiverAuthKeyBytes,
                arrayify(amountSCSHex)
            ]

            const scriptFunction = encodeScriptFunction(functionId, tyArgs, args);

            let rawUserTransaction = generateRawUserTransaction(
                stcAccount.address,
                scriptFunction,
                maxGasAmount,
                gasUnitPrice,
                // @ts-ignore
                senderSequenceNumber,
                expirationTimestampSecs,
                1
            );

            const rawUserTransactionHex = bcsEncode(rawUserTransaction)

            const dryRunRawResult = await provider.dryRunRaw(
                rawUserTransactionHex,
                stcAccount.publicKey
            );

            if (dryRunRawResult.status === 'Executed') {
                maxGasAmount = BigInt(Math.ceil(<number>dryRunRawResult.gas_used * 3))
                rawUserTransaction = generateRawUserTransaction(
                    stcAccount.address,
                    scriptFunction,
                    maxGasAmount,
                    gasUnitPrice,
                    // @ts-ignore
                    senderSequenceNumber,
                    expirationTimestampSecs,
                    1
                );
            }

            const signedUserTransactionHex = await signRawUserTransaction(
                stcAccount.privateKey,
                rawUserTransaction
            );

            const txn = await provider.sendTransaction(signedUserTransactionHex);

            // {
            //     "state_root_hash": "0xd1c8dbd1906989e806d1ebfd994afcf1ecb18ccfd28c96119e0f18ffe28ac1c6",
            //     "event_root_hash": "0xbe2972d55c4fe88ce106d3f26497f8380c00fd551f986597ffe96e0fd619da50",
            //     "gas_used": 288185,
            //     "status": "Executed",
            //     "txn_events": null,
            //     "block_hash": "0x7c0ab03dc8f823079a2f5814b5f9f77fcba175c842bdf83789262ed236daa4a1",
            //     "block_number": 10149962,
            //     "transaction_hash": "0x93bc4381d57ae929fcc5c6a98060f62fe39cb865e43793330944aa674f497b24",
            //     "transaction_index": 1,
            //     "confirmations": 2
            // }
            const txnInfo = await txn.wait(7);
            // @ts-ignore
            return txnInfo.transaction_hash;
        } catch (error) {
            return error as string;
        }
    }

}
