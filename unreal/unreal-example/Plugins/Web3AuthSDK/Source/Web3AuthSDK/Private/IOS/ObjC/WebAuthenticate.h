#pragma once

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#import <SafariServices/SafariServices.h>
#import <AuthenticationServices/ASWebAuthenticationSession.h>

#if __IPHONE_OS_VERSION_MAX_ALLOWED >= 130000
@interface WebAuthenticate: NSObject<ASWebAuthenticationPresentationContextProviding>
+(WebAuthenticate*)Singleton;
-(void)launchUrl: (const char*)url;
@end
#endif
