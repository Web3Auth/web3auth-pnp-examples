// Fill out your copyright notice in the Description page of Project Settings.


#include "Web3Auth.h"

#if PLATFORM_IOS
#include "IOS/ObjC/WebAuthenticate.h"
#endif

FOnLogin AWeb3Auth::loginEvent;
FOnLogout AWeb3Auth::logoutEvent;

#if PLATFORM_ANDROID
JNI_METHOD void Java_com_epicgames_unreal_GameActivity_onDeepLink(JNIEnv* env, jclass clazz, jstring uri) {
	if (JNIEnv* Env = FAndroidApplication::GetJavaEnv(true)) {
		const char* UTFString = Env->GetStringUTFChars(uri, 0);

		FString result = FString(UTF8_TO_TCHAR(UTFString));
		UE_LOG(LogTemp, Warning, TEXT("redirect %s"), *result);

		AWeb3Auth::setResultUrl(result);

		Env->ReleaseStringUTFChars(uri, UTFString);
		Env->DeleteLocalRef(uri);
	}
}

void AWeb3Auth::CallJniVoidMethod(JNIEnv* Env, const jclass Class, jmethodID Method, ...) {
	va_list Args;
	va_start(Args, Method);
	Env->CallStaticVoidMethodV(Class, Method, Args);
	va_end(Args);

	Env->DeleteLocalRef(Class);
}
#endif

// Sets default values
AWeb3Auth::AWeb3Auth()
{
	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;
}

void AWeb3Auth::setOptions(FWeb3AuthOptions options) {
	this->web3AuthOptions = options;
}

void AWeb3Auth::request(FString  path, FLoginParams* loginParams = NULL, TSharedPtr<FJsonObject> extraParams = NULL) {
	TSharedPtr<FJsonObject> paramMap = MakeShareable(new FJsonObject);


	TSharedPtr<FJsonObject> initParams = MakeShareable(new FJsonObject);
	initParams->SetStringField("clientId", web3AuthOptions.clientId);

	switch (web3AuthOptions.network) {
		case FNetwork::MAINNET:
			initParams->SetStringField("network", "mainnet");
			break;
		case FNetwork::TESTNET:
			initParams->SetStringField("network", "testnet");
			break;
		case FNetwork::CYAN:
			initParams->SetStringField("network", "cyan");
			break;

	}

	if (web3AuthOptions.redirectUrl != "")
		initParams->SetStringField("redirectUrl", web3AuthOptions.redirectUrl);

#if !PLATFORM_ANDROID && !PLATFORM_IOS
	FString redirectUrl = startLocalWebServer();
	initParams->SetStringField("redirectUrl", redirectUrl);
#endif

	if (web3AuthOptions.whiteLabel.name != "") {
		FString output;
		this->GetJsonStringFromStruct(web3AuthOptions.whiteLabel, output);

		initParams->SetStringField("whiteLabel", output);
	}

	if (!web3AuthOptions.loginConfig.IsEmpty()) {
		FString output;

		TSharedPtr<FJsonObject> loginConfigMap = MakeShareable(new FJsonObject);

		for (auto item : web3AuthOptions.loginConfig) {
			TSharedPtr<FJsonObject> loginConfigObject = MakeShareable(new FJsonObject);
			FJsonObjectConverter::UStructToJsonObject(FLoginConfigItem::StaticStruct(), &item.Value, loginConfigObject.ToSharedRef(), 0, 0);

			loginConfigMap->SetObjectField(item.Key, loginConfigObject);
		}

		TSharedRef< TJsonWriter<> > Writer = TJsonWriterFactory<>::Create(&output);
		FJsonSerializer::Serialize(loginConfigMap.ToSharedRef(), Writer);

		initParams->SetStringField("loginConfig", output);
	}

	paramMap->SetObjectField("init", initParams.ToSharedRef());

	
	TSharedPtr<FJsonObject> params = MakeShareable(new FJsonObject);

	if (extraParams != NULL) {
		params = extraParams;
	}

	if (loginParams != NULL) {
		for (auto o : loginParams->getJsonObject().Values) {
			params->SetField(o.Key, o.Value);
		}
	}

	paramMap->SetObjectField("params", params.ToSharedRef());
	

	FString json;

	TSharedRef< TJsonWriter<> > Writer = TJsonWriterFactory<>::Create(&json);
	FJsonSerializer::Serialize(paramMap.ToSharedRef(), Writer);

	const FString jsonOutput = json;
	FString base64 = FBase64::Encode(jsonOutput);

	FString url = web3AuthOptions.sdkUrl + "/" + path + "#" + base64;

#if PLATFORM_ANDROID
	if (JNIEnv* Env = FAndroidApplication::GetJavaEnv(true)) {
		jstring jurl = Env->NewStringUTF(TCHAR_TO_UTF8(*url));

		jclass jbrowserViewClass = FAndroidApplication::FindJavaClass("com/Plugins/Web3AuthSDK/BrowserView");
		static jmethodID jlaunchUrl = FJavaWrapper::FindStaticMethod(Env, jbrowserViewClass, "launchUrl", "(Landroid/app/Activity;Ljava/lang/String;)V", false);

		CallJniVoidMethod(Env, jbrowserViewClass, jlaunchUrl, FJavaWrapper::GameActivityThis, jurl);
	}
#elif PLATFORM_IOS
	[[WebAuthenticate Singleton] launchUrl:TCHAR_TO_ANSI(*url)];
#else
	FPlatformProcess::LaunchURL(*url, NULL, NULL);
#endif
}

void AWeb3Auth::processLogin(FLoginParams loginParams) {
	UE_LOG(LogTemp, Warning, TEXT("login called"));
	this->request("login", &loginParams);
}

/*void AWeb3Auth::logout(FJsonObject params) {
	this->request("logout", NULL, &params);
}*/

void AWeb3Auth::proccessLogout(FString redirectUrl, FString appState) {
	TSharedPtr<FJsonObject> extraParams = MakeShareable(new FJsonObject);

	if (redirectUrl != "")
		extraParams->SetStringField("redirectUrl", redirectUrl);

	if (appState != "")
		extraParams->SetStringField("appState", appState);

	this->request("logout", NULL, extraParams);
}

void AWeb3Auth::setResultUrl(FString hash) {
	
	if (hash.IsEmpty()) {
		return;
	}


	UE_LOG(LogTemp, Warning, TEXT("respose base64 %s"), *hash);

	FString json = "";

	FString output = hash;
	output = output.Replace(TEXT("-"), TEXT("+"));
	output = output.Replace(TEXT("_"), TEXT("/"));
	switch (output.Len() % 4)	{
		case 0: break;
		case 2: output += "=="; break;
		case 3: output += "="; break;
		default: 
			return;
	}

	FBase64::Decode(output, json);

	UE_LOG(LogTemp, Warning, TEXT("respose json %s"), *json);


	FWeb3AuthResponse web3AuthResponse;

	if (!FJsonObjectConverter::JsonObjectStringToUStruct(json, &web3AuthResponse, 0, 0)) {
		UE_LOG(LogTemp, Warning, TEXT("failed to parse json"));
	}

	if (web3AuthResponse.error != "") {
		return;
	}

	if (web3AuthResponse.privKey.IsEmpty() || web3AuthResponse.privKey == "0000000000000000000000000000000000000000000000000000000000000000") {
		AsyncTask(ENamedThreads::GameThread, [=]() {
			AWeb3Auth::logoutEvent.ExecuteIfBound();
		});	
	}
	else {
		AsyncTask(ENamedThreads::GameThread, [=]() {
			AWeb3Auth::loginEvent.ExecuteIfBound(web3AuthResponse);
		});
	}
}

template <typename StructType>
void AWeb3Auth::GetJsonStringFromStruct(StructType FilledStruct, FString& StringOutput) {
	FJsonObjectConverter::UStructToJsonObjectString(StructType::StaticStruct(), &FilledStruct, StringOutput, 0, 0);
}

FString AWeb3Auth::startLocalWebServer() {
	FHttpServerModule& httpServerModule = FHttpServerModule::Get();

	httpServerModule.StopAllListeners();

	int32 port = FMath::RandRange(1024, 65535);
	httpRouter = httpServerModule.GetHttpRouter(port);

	while (!httpRouter.IsValid()) {
		httpRouter.Reset();

		port = FMath::RandRange(1024, 65535);
		httpRouter = httpServerModule.GetHttpRouter(port);
	}

	if (httpRouter.IsValid()) {
		auto x = httpRouter->BindRoute(FHttpPath(TEXT("/auth")), EHttpServerRequestVerbs::VERB_GET,
			[this](const FHttpServerRequest& Request, const FHttpResultCallback& OnComplete) { return requestAuthCallback(Request, OnComplete); });

		auto y = httpRouter->BindRoute(FHttpPath(TEXT("/complete")), EHttpServerRequestVerbs::VERB_GET,
			[this](const FHttpServerRequest& Request, const FHttpResultCallback& OnComplete) { return requestCompleteCallback(Request, OnComplete); });

		httpRoutes.Add(TPairInitializer<TSharedPtr<IHttpRouter>, FHttpRouteHandle>(httpRouter, x));
		httpRoutes.Add(TPairInitializer<TSharedPtr<IHttpRouter>, FHttpRouteHandle>(httpRouter, y));
	}

	httpServerModule.StartAllListeners();

	return "http://localhost:"+ FString::FromInt(port) + "/complete";
}


bool AWeb3Auth::requestAuthCallback(const FHttpServerRequest& Request, const FHttpResultCallback& OnComplete) {
	FString code = Request.QueryParams["code"];

	if (!code.IsEmpty()) {
		AWeb3Auth::setResultUrl(code);
	}

	TUniquePtr<FHttpServerResponse> response = FHttpServerResponse::Create(TEXT("OK"), TEXT("text/html"));
	OnComplete(MoveTemp(response));

	FHttpServerModule::Get().StopAllListeners();
	for (auto route : httpRoutes) {
		route.Key->UnbindRoute(route.Value);
	}
	httpRoutes.Empty();

	return true;
}

bool AWeb3Auth::requestCompleteCallback(const FHttpServerRequest& Request, const FHttpResultCallback& OnComplete)
{
	FString text = R"html(
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name='viewport' content='width=device-width'>
			<title>Web3Auth</title>
			<link href='https://fonts.googleapis.com/css2?family=DM+Sans:wght@500&display=swap' rel='stylesheet'>
		</head>
		<body style="padding:0;margin:0;font-size:10pt;font-family: 'DM Sans', sans-serif;">
			<div style="display:flex;align-items:center;justify-content:center;height:100vh;display: none;" id="success">
			<div style="text-align:center">
				<h2 style="margin-bottom:0"> Authenticated successfully</h2>
				<p> You can close this tab/window now </p>
			</div>
			</div>
			<div style="display:flex;align-items:center;justify-content:center;height:100vh;display: none;" id="error">
			<div style="text-align:center">
				<h2 style="margin-bottom:0"> Authentication failed</h2>
				<p> Please try again </p>
			</div>
			</div>
			<script>
			if (window.location.hash.trim() == "") {
				document.querySelector("#error").style.display="flex";
			} else {
				fetch(`http://${window.location.host}/auth/?code=${window.location.hash.slice(1,window.location.hash.length)}`).then(function(response) {
					console.log(response);
					document.querySelector("#success").style.display="flex";
				}).catch(function(error) {
					console.log(error);
					document.querySelector("#error").style.display="flex";
				});
			}
                    
			</script>
		</body>
		</html>)html";

	TUniquePtr<FHttpServerResponse> response = FHttpServerResponse::Create(*text, TEXT("text/html"));
	OnComplete(MoveTemp(response));

	return true;
}

void AWeb3Auth::setLoginEvent(FOnLogin _event) {
	loginEvent = _event;
}

void AWeb3Auth::setLogoutEvent(FOnLogout _event) {
	logoutEvent = _event;
}

#if PLATFORM_IOS
void AWeb3Auth::callBackFromWebAuthenticateIOS(NSString* sResult) {
    FString result = FString(sResult);
    AWeb3Auth::setResultUrl(result);
}
#endif

void AWeb3Auth::BeginPlay() {
	Super::BeginPlay();
}


void AWeb3Auth::EndPlay(const EEndPlayReason::Type EndPlayReason) {
	Super::EndPlay(EndPlayReason);

	FHttpServerModule::Get().StopAllListeners();

	for (auto route : httpRoutes) {
		route.Key->UnbindRoute(route.Value);
	}
	httpRoutes.Empty();
}

void AWeb3Auth::Tick(float DeltaTime) {
	Super::Tick(DeltaTime);
}

AWeb3Auth::~AWeb3Auth() {
}

