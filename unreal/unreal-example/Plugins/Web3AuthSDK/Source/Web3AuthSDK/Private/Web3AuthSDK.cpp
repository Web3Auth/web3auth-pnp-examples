// Copyright Epic Games, Inc. All Rights Reserved.

#include "Web3AuthSDK.h"

#define LOCTEXT_NAMESPACE "FWeb3AuthSDKModule"

void FWeb3AuthSDKModule::StartupModule()
{
	// This code will execute after your module is loaded into memory; the exact timing is specified in the .uplugin file per-module
}

void FWeb3AuthSDKModule::ShutdownModule()
{
	// This function may be called during shutdown to clean up your module.  For modules that support dynamic reloading,
	// we call this function before unloading the module.
}

#undef LOCTEXT_NAMESPACE
	
IMPLEMENT_MODULE(FWeb3AuthSDKModule, Web3AuthSDK)