import { Stack, Fn, CfnOutput } from "@aws-cdk/core";
import {
    HttpVersion,
    ViewerProtocolPolicy,
    OriginProtocolPolicy,
    CfnDistribution,
    SSLMethod,
} from "@aws-cdk/aws-cloudfront";
import {
    Duration
} from '@aws-cdk/core'
import { StackParameters } from "../parameters";
import { CFNConditionNames } from "../conditions";

export type CloudFrontResourceParmas = {
    ec2DNSName: string;
}

const allowedMethods = {
    GET_HEAD: ["GET", "HEAD"],
    ALL: [
        "DELETE",
        "GET",
        "HEAD",
        "OPTIONS",
        "PATCH",
        "POST",
        "PUT"
    ]
}

export default class CloudFrontResource {
    public static create(stack: Stack, {
        cdnCookieWhiteLists,
        cdnPriceClass,
        certificationARN,
        domain,
    }: StackParameters, {
        ec2DNSName,
    }: CloudFrontResourceParmas): CfnDistribution {
        const originIdWordPress = 'WordPress'

        const cdn = new CfnDistribution(stack, 'CloudFront', {
            distributionConfig: {
                enabled: true,
                aliases: Fn.conditionIf(
                    CFNConditionNames.HasACMCertificationARN,
                    [domain.valueAsString],
                    []
                ) as any as string[],
                //aliases: [domain.valueAsString],
                cacheBehaviors: [{
                    compress: true,
                    allowedMethods: allowedMethods.GET_HEAD,
                    cachedMethods: allowedMethods.GET_HEAD,
                    forwardedValues: {
                      headers: [
                        "Accept",
                        "Authorization",
                        "CloudFront-Forwarded-Proto",
                        "Host",
                        "Origin",
                      ],
                      queryString: true,
                      cookies: Fn.conditionIf(
                        CFNConditionNames.HasCDNCookieWhiteLists,
                        {
                          Forward: 'whitelist',
                          WhitelistedNames: cdnCookieWhiteLists.valueAsList
                        },
                        {
                          Forward: 'none'
                        }
                      )
                    },
                    minTtl: Duration.minutes(10).toSeconds(),
                    defaultTtl: Duration.hours(1).toSeconds(),
                    maxTtl: Duration.days(1).toSeconds(),
                    pathPattern: "feed*",
                    targetOriginId: originIdWordPress,
                    viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL
                  }, {
                    compress: true,
                    targetOriginId: originIdWordPress,
                    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    allowedMethods: allowedMethods.ALL,
                    cachedMethods: allowedMethods.GET_HEAD,
                    forwardedValues: {
                      headers: [
                        "Accept",
                        "Authorization",
                        "CloudFront-Forwarded-Proto",
                        "Host",
                        "Content-Type",
                        "Origin",
                      ],
                      queryString: true,
                      cookies: Fn.conditionIf(
                        CFNConditionNames.HasCDNCookieWhiteLists,
                        {
                          Forward: 'whitelist',
                          WhitelistedNames: cdnCookieWhiteLists.valueAsList
                        },
                        {
                          Forward: 'all'
                        }
                      )
                    },
                    minTtl: Duration.seconds(30).toSeconds(),
                    defaultTtl: Duration.minutes(1).toSeconds(),
                    maxTtl: Duration.minutes(1).toSeconds(),
                    pathPattern: "wp-json/*"
                  }, {
                    compress: true,
                    targetOriginId: originIdWordPress,
                    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    allowedMethods: allowedMethods.GET_HEAD,
                    cachedMethods: allowedMethods.GET_HEAD,
                    forwardedValues: {
                      headers: [
                        "Accept",
                        "Authorization",
                        "CloudFront-Forwarded-Proto",
                        "Host",
                        "Origin"
                      ],
                      queryString: true,
                      cookies: {
                        forward: 'none'
                      }
                    },
                    minTtl: Duration.days(0.5).toSeconds(),
                    defaultTtl: Duration.days(1).toSeconds(),
                    maxTtl: Duration.days(365).toSeconds(),
                    pathPattern: "wp-content/*"
                  }, {
                    compress: true,
                    targetOriginId: originIdWordPress,
                    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    allowedMethods: allowedMethods.GET_HEAD,
                    cachedMethods: allowedMethods.GET_HEAD,
                    forwardedValues: {
                      headers: [
                        "Accept",
                        "Authorization",
                        "CloudFront-Forwarded-Proto",
                        "Host",
                        "Origin"
                      ],
                      queryString: true,
                      cookies: {
                        forward: 'none'
                      }
                    },
                    minTtl: Duration.days(0.5).toSeconds(),
                    defaultTtl: Duration.days(1).toSeconds(),
                    maxTtl: Duration.days(1).toSeconds(),
                    pathPattern: "wp-includes/*"
                  }, {
                    compress: true,
                    targetOriginId: originIdWordPress,
                    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    allowedMethods: allowedMethods.ALL,
                    cachedMethods: allowedMethods.GET_HEAD,
                    forwardedValues: {
                      headers: [
                        "Accept",
                        "Authorization",
                        "CloudFront-Forwarded-Proto",
                        "Host",
                        "Origin",
                        "Referer",
                        "User-Agent"
                      ],
                      queryString: true,
                      cookies: Fn.conditionIf(
                        CFNConditionNames.HasCDNCookieWhiteLists,
                        {
                          Forward: 'whitelist',
                          WhitelistedNames: cdnCookieWhiteLists.valueAsList
                        },
                        {
                          Forward: 'all'
                        }
                      )
                    },
                    minTtl: Duration.seconds(0).toSeconds(),
                    defaultTtl: Duration.hours(1).toSeconds(),
                    maxTtl: Duration.days(1).toSeconds(),
                    pathPattern: "wp-admin/*"
                  }, {
                    compress: true,
                    targetOriginId: originIdWordPress,
                    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    allowedMethods: allowedMethods.ALL,
                    cachedMethods: allowedMethods.GET_HEAD,
                    forwardedValues: {
                      headers: [
                        "Accept",
                        "Authorization",
                        "CloudFront-Forwarded-Proto",
                        "Host",
                        "Origin",
                        "Referer",
                        "User-Agent"
                      ],
                      queryString: true,
                      cookies: {
                        forward: "all"
                      }
                    },
                    minTtl: Duration.seconds(0).toSeconds(),
                    defaultTtl: Duration.hours(1).toSeconds(),
                    maxTtl: Duration.days(1).toSeconds(),
                    pathPattern: "*.php"
                  }, {
                    compress: true,
                    targetOriginId: originIdWordPress,
                    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    allowedMethods: allowedMethods.ALL,
                    cachedMethods: allowedMethods.GET_HEAD,
                    forwardedValues: {
                      headers: [
                        "Accept",
                        "Authorization",
                        "CloudFront-Forwarded-Proto",
                        "Host",
                        "Origin",
                        "Referer"
                      ],
                      queryString: true,
                      cookies: Fn.conditionIf(
                        CFNConditionNames.HasCDNCookieWhiteLists,
                        {
                          Forward: 'whitelist',
                          WhitelistedNames: cdnCookieWhiteLists.valueAsList
                        },
                        {
                          Forward: 'all'
                        }
                      )
                    },
                    minTtl: Duration.seconds(30).toSeconds(),
                    defaultTtl: Duration.minutes(1).toSeconds(),
                    maxTtl: Duration.minutes(1).toSeconds(),
                    pathPattern: "wp-admin/admin-ajax.php"
                  }, {
                    compress: true,
                    targetOriginId: originIdWordPress,
                    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    allowedMethods: allowedMethods.GET_HEAD,
                    cachedMethods: allowedMethods.GET_HEAD,
                    forwardedValues: {
                      headers: [
                        "Accept",
                        "Authorization",
                        "CloudFront-Forwarded-Proto",
                        "Host",
                        "Origin",
                        "Referer"
                      ],
                      queryString: true,
                      cookies: Fn.conditionIf(
                        CFNConditionNames.HasCDNCookieWhiteLists,
                        {
                          Forward: 'whitelist',
                          WhitelistedNames: cdnCookieWhiteLists.valueAsList
                        },
                        {
                          Forward: 'all'
                        }
                      )
                    },
                    minTtl: Duration.hours(1).toSeconds(),
                    defaultTtl: Duration.hours(1).toSeconds(),
                    maxTtl: Duration.days(1).toSeconds(),
                    pathPattern: "wp-admin/load-*.php"
                  }].reverse(),
                comment: 'Web Distribution for WordPress powered by AMIMOTO',
                defaultCacheBehavior: {
                    compress: false,
                    allowedMethods: allowedMethods.ALL,
                    cachedMethods: allowedMethods.GET_HEAD,
                    forwardedValues: {
                      headers: [
                        "Accept",
                        "Authorization",
                        "CloudFront-Forwarded-Proto",
                        "CloudFront-Is-Desktop-Viewer",
                        "CloudFront-Is-Mobile-Viewer",
                        "CloudFront-Is-Tablet-Viewer",
                        "Host",
                        "Origin"
                      ],
                      queryString: true,
                      cookies: Fn.conditionIf(
                        CFNConditionNames.HasCDNCookieWhiteLists,
                        {
                          Forward: 'whitelist',
                          WhitelistedNames: cdnCookieWhiteLists.valueAsList
                        },
                        {
                          Forward: 'all'
                        }
                      )
                    },
                    minTtl: Duration.minutes(10).toSeconds(),
                    defaultTtl: Duration.hours(1).toSeconds(),
                    maxTtl: Duration.hours(1).toSeconds(),
                    targetOriginId: originIdWordPress,
                    viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL
                },
                defaultRootObject: "index.php",
                httpVersion: HttpVersion.HTTP2,
                ipv6Enabled: true,
                origins: [{
                    customOriginConfig: {
                        httpPort: 80,
                        httpsPort: 443,
                        originKeepaliveTimeout: 5,
                        originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY,
                        originReadTimeout: 60,
                        originSslProtocols: [
                            "TLSv1.2"
                        ]
                    },
                    domainName: ec2DNSName,
                    id: originIdWordPress
                }],
                priceClass: cdnPriceClass.valueAsString,
                viewerCertificate: Fn.conditionIf(
                    CFNConditionNames.HasACMCertificationARN,
                    {
                        CloudFrontDefaultCertificate: false,
                        AcmCertificateArn: certificationARN.valueAsString,
                        MinimumProtocolVersion: ViewerProtocolPolicy.HTTPS_ONLY,
                        SslSupportMethod: SSLMethod.SNI
                    },
                    {
                        CloudFrontDefaultCertificate: true
                    }
                ),
            }
        })
        
          new CfnOutput(stack, 'Domain', {
              value: cdn.getAtt('DomainName').toString(),
          })
          return cdn
    }
}