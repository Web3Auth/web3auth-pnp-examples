import { nodeDetailManager, torus } from "./config";


/**
 * This function gets user's public address details from Web3Auth network
 * 
 * UserId: This is the user id that we get from firebase, if you are not
 * using firebase this field's value should be the value of `verifierIdField`
 * that you have set in the dashboard while creating verifier.
 */
const getWeb3AuthUserDetails = async (userId: string, verifierName: string) => {
    // get details of the node shares on the torus network
    const { torusNodeEndpoints, torusNodePub } = await nodeDetailManager.getNodeDetails({ verifier: verifierName, verifierId: userId });
    const userDetails = await torus.getUserTypeAndAddress(torusNodeEndpoints, torusNodePub,  { verifier: verifierName, verifierId: userId }, true);
    return userDetails
}

export const isMfaEnabled = async (userId: string, verifierName: string):Promise<boolean> => {
  const web3authUser = await getWeb3AuthUserDetails(userId, verifierName);
  // if upgraded is false, it means that the user hasn't upgraded the account with
  // mfa security.
  if (web3authUser.typeOfUser === "v2" && !web3authUser.upgraded) {
    return false;
  }
  return true;
}
