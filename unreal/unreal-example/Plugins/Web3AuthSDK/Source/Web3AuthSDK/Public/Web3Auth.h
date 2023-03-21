// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"


#include "Json.h"
#include "JsonUtilities.h"

#include "Misc/Base64.h"



#include "Runtime/Online/HTTPServer/Public/HttpPath.h"
#include "Runtime/Online/HTTPServer/Public/IHttpRouter.h"
#include "Runtime/Online/HTTPServer/Public/HttpServerHttpVersion.h"
#include "Runtime/Online/HTTPServer/Public/HttpServerModule.h"
#include "Runtime/Online/HTTPServer/Public/HttpServerResponse.h"


#if PLATFORM_ANDROID
#include "../../../Launch/Public/Android/AndroidJNI.h"
#include "Android/AndroidApplication.h"
#endif


#include "Web3Auth.generated.h"



UENUM(BlueprintType)
enum class FDisplay : uint8
{
	PAGE,
	POPUP,
	TOUCH,
	WAP
};

UENUM(BlueprintType)
enum class FPrompt : uint8
{
	NONE,
	LOGIN,
	CONSENT,
	SELECT_ACCOUNT
};

UENUM(BlueprintType)
enum class FProvider : uint8
{
	GOOGLE,
	FACEBOOK,
	REDDIT,
	DISCORD,
	TWITCH,
	APPLE,
	LINE,
	GITHUB,
	KAKAO,
	LINKEDIN,
	TWITTER,
	WEIBO,
	WECHAT,
	EMAIL_PASSWORDLESS,
	EMAIL_PASSWORD,
	JWT
};

UENUM(BlueprintType)
enum class FTypeOfLogin : uint8
{
	GOOGLE,
	FACEBOOK,
	REDDIT,
	DISCORD,
	TWITCH,
	APPLE,
	LINE,
	GITHUB,
	KAKAO,
	LINKEDIN,
	TWITTER,
	WEIBO,
	WECHAT,
	EMAIL_PASSWORDLESS,
	EMAIL_PASSWORD,
	JWT
};

UENUM(BlueprintType)
enum class FCurve : uint8
{
    SECP256K1,
    ED25519
};

UENUM(BlueprintType)
enum class FMFALevel : uint8
{
	DEFAULT,
	OPTIONAL,
	MANDATORY,
	NONE
};

UENUM(BlueprintType)
enum class FNetwork : uint8
{
	MAINNET = 0, TESTNET = 1, CYAN = 2
};


USTRUCT(BlueprintType)
struct WEB3AUTHSDK_API FExtraLoginOptions
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString domain;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString client_id;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString leeway;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString verifierIdField;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString max_age;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString ui_locales;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString id_token_hint;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString login_hint;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString acr_values;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString scope;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString audience;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString connection;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString state;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString response_type;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString nonce;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString redirect_uri;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		bool isVerifierIdCaseSensitive;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FDisplay display;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FPrompt prompt;

	FExtraLoginOptions() {};

	TSharedPtr<FJsonObject> getJsonObject() {
		TSharedPtr<FJsonObject> output = MakeShareable(new FJsonObject);

		if (!domain.IsEmpty())
			output->SetStringField("domain", domain);

		if (!client_id.IsEmpty())
			output->SetStringField("client_id", client_id);

		if (!leeway.IsEmpty())
			output->SetStringField("leeway", leeway);

		if (!verifierIdField.IsEmpty())
			output->SetStringField("verifierIdField", verifierIdField);

		if (!max_age.IsEmpty())
			output->SetStringField("max_age", max_age);

		if (!ui_locales.IsEmpty())
			output->SetStringField("ui_locales", ui_locales);

		if (!id_token_hint.IsEmpty())
			output->SetStringField("id_token_hint", id_token_hint);

		if (!login_hint.IsEmpty())
			output->SetStringField("login_hint", login_hint);

		if (!acr_values.IsEmpty())
			output->SetStringField("acr_values", acr_values);

		if (!scope.IsEmpty())
			output->SetStringField("scope", scope);

		if (!audience.IsEmpty())
			output->SetStringField("audience", audience);

		if (!connection.IsEmpty())
			output->SetStringField("connection", connection);

		if (!state.IsEmpty())
			output->SetStringField("state", state);

		if (!response_type.IsEmpty())
			output->SetStringField("response_type", response_type);

		if (!nonce.IsEmpty())
			output->SetStringField("nonce", nonce);

		if (!redirect_uri.IsEmpty())
			output->SetStringField("redirect_uri", redirect_uri);


		if (output->Values.IsEmpty()) {
			return nullptr;
		}

		output->SetBoolField("isVerifierIdCaseSensitive", isVerifierIdCaseSensitive);

		switch (display) {
		case FDisplay::PAGE:
			output->SetStringField("display", "page");
			break;
		case FDisplay::POPUP:
			output->SetStringField("display", "popup");
			break;
		case FDisplay::TOUCH:
			output->SetStringField("display", "touch");
			break;
		case FDisplay::WAP:
			output->SetStringField("display", "wap");
			break;
		}

		switch (prompt) {
		case FPrompt::CONSENT:
			output->SetStringField("prompt", "consent");
			break;
		case FPrompt::LOGIN:
			output->SetStringField("prompt", "login");
			break;
		case FPrompt::NONE:
			output->SetStringField("prompt", "none");
			break;
		case FPrompt::SELECT_ACCOUNT:
			output->SetStringField("prompt", "select_acocunt");
			break;
		}

		return output;
	}

};

USTRUCT(BlueprintType)
struct FLoginConfigItem
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString verifier;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString typeOfLogin;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString name;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString description;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString clientId;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString verifierSubIdentifier;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString logoHover;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString logoLight;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString logoDark;
	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		bool mainOption;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		bool showOnModal;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		bool showOnDesktop;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		bool showOnMobile;

	FLoginConfigItem() {};

	bool operator== (const FLoginConfigItem& other) {
		return other.clientId == clientId;
	}

};


FORCEINLINE uint32 GetTypeHash(const FLoginConfigItem& other) {
	return GetTypeHash(other.clientId);
}


USTRUCT(BlueprintType)
struct FLoginParams
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString loginProvider;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString dappShare;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FExtraLoginOptions extraLoginOptions;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString appState;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString redirectUrl;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FMFALevel mfaLevel;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FCurve curve;

	FLoginParams() {};

	FJsonObject getJsonObject() {
		FJsonObject output;

		if (!appState.IsEmpty())
			output.SetStringField("appState", appState);

		if (!dappShare.IsEmpty())
			output.SetStringField("dappShare", dappShare);

		if (!loginProvider.IsEmpty())
			output.SetStringField("loginProvider", loginProvider);

		if (!redirectUrl.IsEmpty())
			output.SetStringField("redirectUrl", redirectUrl);

		if (extraLoginOptions.getJsonObject() != nullptr)
			output.SetObjectField("extraLoginOptions", extraLoginOptions.getJsonObject());

		return output;
	}
};


USTRUCT(BlueprintType)
struct FUserInfo
{
	GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
        FString email;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString name;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString profileImage;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString aggregateVerifier;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString verifier;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString verifierId;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString typeOfLogin;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString dappShare;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString idToken;
    
    UPROPERTY(EditAnywhere, BlueprintReadWrite)
        FString oAuthIdToken;
	
	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString oAuthAccessToken;

	FUserInfo() {};

};



USTRUCT(BlueprintType)
struct FWhiteLabelData
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString name;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString logoLight;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString logoDark;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString defaultLanguage;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		bool dark;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		TMap<FString, FString> theme;

	FWhiteLabelData() {};

	void operator= (const FWhiteLabelData& other) {
		name = other.name;
		logoLight = other.logoLight;
		logoDark = other.logoDark;
		defaultLanguage = other.defaultLanguage;
		dark = other.dark;
		theme = other.theme;
	}

};


USTRUCT(BlueprintType)
struct FWeb3AuthOptions
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString clientId;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString redirectUrl;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString sdkUrl = "https://sdk.openlogin.com";

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FNetwork network;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FWhiteLabelData whiteLabel;

	UPROPERTY(BlueprintReadWrite)
		TMap<FString, FLoginConfigItem> loginConfig;


	FWeb3AuthOptions() {};

	void operator= (const FWeb3AuthOptions& other) {
		clientId = other.clientId;
		redirectUrl = other.redirectUrl;
		sdkUrl = other.sdkUrl;
		network = other.network;
		whiteLabel = other.whiteLabel;
		loginConfig = other.loginConfig;
	}

};


USTRUCT(BlueprintType)
struct FWeb3AuthResponse
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString privKey;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString ed25519PrivKey;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString error;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FString sessionId;

	UPROPERTY(EditAnywhere, BlueprintReadWrite)
		FUserInfo userInfo;

	FWeb3AuthResponse() {};

};


DECLARE_DYNAMIC_DELEGATE_OneParam(FOnLogin, FWeb3AuthResponse, response);
DECLARE_DYNAMIC_DELEGATE(FOnLogout);


UCLASS()
class WEB3AUTHSDK_API AWeb3Auth : public AActor
{
	GENERATED_BODY()

	FWeb3AuthOptions web3AuthOptions;

	TSharedPtr<IHttpRouter> httpRouter;
	TArray<TPair<TSharedPtr<IHttpRouter>, FHttpRouteHandle>> httpRoutes;

	static FOnLogin loginEvent;
	static FOnLogout logoutEvent;

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

	virtual void EndPlay(const EEndPlayReason::Type EndPlayReason) override;

public:
	// Called every frame
	virtual void Tick(float DeltaTime) override;

public:
	AWeb3Auth();

	UFUNCTION(BlueprintCallable)
		void setOptions(FWeb3AuthOptions web3authOptions);

	UFUNCTION(BlueprintCallable)
		void processLogin(FLoginParams loginParams);

	/*UFUNCTION(BlueprintCallable)
		void logout(FJsonObject params);*/

	UFUNCTION(BlueprintCallable)
		void proccessLogout(FString redirectUrl = "", FString appState = "");

	UFUNCTION(BlueprintCallable)
		static void setResultUrl(FString code);

	UFUNCTION(BlueprintCallable, Category = "Web3Auth")
		static void setLoginEvent(FOnLogin _event);

	UFUNCTION(BlueprintCallable, Category = "Web3Auth")
		static void setLogoutEvent(FOnLogout _event);

	UFUNCTION(BlueprintCallable)
		static FString Web3AuthResponseToJsonString(FWeb3AuthResponse response) {
		FString output;
		FJsonObjectConverter::UStructToJsonObjectString(FWeb3AuthResponse::StaticStruct(), &response, output, 0, 0);

		return output;
	}

    #if PLATFORM_IOS
    static void callBackFromWebAuthenticateIOS(NSString* sResult);
    #endif
    
	~AWeb3Auth();
private:
	void request(FString  path, FLoginParams* loginParams, TSharedPtr<FJsonObject> extraParam);

	template <typename StructType>
	void GetJsonStringFromStruct(StructType FilledStruct, FString& StringOutput);

#if PLATFORM_ANDROID
	void CallJniVoidMethod(JNIEnv* Env, const jclass Class, jmethodID Method, ...);
#endif

	FString startLocalWebServer();

	bool requestAuthCallback(const FHttpServerRequest& Request, const FHttpResultCallback& OnComplete);
	bool requestCompleteCallback(const FHttpServerRequest& Request, const FHttpResultCallback& OnComplete);
};
