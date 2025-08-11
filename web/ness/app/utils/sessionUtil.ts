import { getSession } from "@/session.server";
import { COOKIE, ENCRYPT_KEY } from "@/types/enum";
import { LoaderFunctionArgs } from "react-router";

export const getUserEncryptKeyFromSession = async ({request}: LoaderFunctionArgs) =>{
    const session = await getSession(request.headers.get(COOKIE));
    // 임시
    session.set(ENCRYPT_KEY, '20EVUqAhRwzlvABlIdEZXw3Myx4LQ3aDkNOtFc5ZeJ_ZaXHkeHyUpPNso38z3Zfla2dHvIM9NemlifYE_wIKOlo4fcKnd3aPZiK_r8bei-krNhZ8tIXtSBEHs5bUn-nRF_FaslrP00rJHlAdIRIBi2sDP4VD2fPRdpyR31DXWUnZhrwBVxMbquuJwB8RaL8iuphMK_amr7V5jYFQgJsBZeP456IaXF2baL7qJr1H098aE6wQcMT81R5Sx8tQEsnSZHKjBB7UkBrnoA0MeIT3ec3ryyP82OXTNjZR7GaBbEmaSN_ki6_z1AqsBb34XItga0I7HNIR3ggBKpqQJeAyfRaehvbAIxW28Alh_EkxB7kcmdi72ma3hyrJQV6hQ4ekMyK2AYcfxp3SqmIvsOqID-jF3SvZ0S7WXCrQRvbVZ428J5AZ5xiYxFUBldmzf-i2kgcOSIJ_2WI=');
    return session.get(ENCRYPT_KEY) as string;
} 