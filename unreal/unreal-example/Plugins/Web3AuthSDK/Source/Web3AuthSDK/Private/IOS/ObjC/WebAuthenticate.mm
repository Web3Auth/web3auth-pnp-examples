#import "WebAuthenticate.h"
#import <AuthenticationServices/ASWebAuthenticationSession.h>
#include <Web3Auth.h>

API_AVAILABLE(ios(12.0))
ASWebAuthenticationSession *_authSession;

@implementation WebAuthenticate

- (instancetype)init
{
    self = [super init];
    return self;
}

+ (WebAuthenticate *)Singleton
{
    static WebAuthenticate *staticWebAuthenticate;
    static dispatch_once_t once;
    dispatch_once(&once, ^{
        staticWebAuthenticate = [[self alloc] init];
    });
    return staticWebAuthenticate;
}


- (void) launchUrl:(const char*)url
{
    NSURL * URL = [NSURL URLWithString: [[NSString alloc] initWithUTF8String:url]];
    NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];

    ASWebAuthenticationSession* authSession = [[ASWebAuthenticationSession alloc] initWithURL:URL callbackURLScheme:bundleIdentifier completionHandler:^(NSURL * _Nullable callbackURL, NSError * _Nullable error) {
        
        if(callbackURL) {
            AWeb3Auth::callBackFromWebAuthenticateIOS(callbackURL.fragment);
        } else {
            return;
        }
    }];
    
    _authSession = authSession;
    if (@available(iOS 13, *)) {
        _authSession.presentationContextProvider = (id) self;
    }

    [_authSession start];
}

- (nonnull ASPresentationAnchor)presentationAnchorForWebAuthenticationSession:(nonnull ASWebAuthenticationSession *)session API_AVAILABLE(ios(13.0)){
    return [[[UIApplication sharedApplication] windows] firstObject];
}

@end
