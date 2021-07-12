import { useCallback, useMemo, useState } from "react";
import useAxios, { Options, RefetchOptions, ResponseValues } from "axios-hooks";
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  useGoogleLogin,
} from "react-google-login";
import { toast } from "react-toastify";
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "axios";
import {
  AuthenticationData,
  CheckAccountPostData,
  GmailLoginPostData,
  LoginDetails,
  PasswordLoginPostData,
} from "../../types/auth";
import {
  errorHandlerWrapper,
  isForbiddenOrNotAuthenticated,
  resolveApiError,
} from "../../utils/error-utils";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setCurrentUserAction,
  selectCurrentUser,
} from "../../redux/slices/current-user-slice";
import { resetReduxState } from "../../redux/store";

export function useAxiosWithTokenRefresh<T>(
  config: AxiosRequestConfig,
  options?: Options,
): [
  ResponseValues<T, Error>,
  (config?: AxiosRequestConfig, options?: RefetchOptions) => AxiosPromise<T>,
  () => void,
] {
  const { access, refresh } = useAppSelector(selectCurrentUser) ?? {};
  const dispatch = useAppDispatch();
  const [responseValues, apiCall, cancel] = useAxios<T>(
    {
      ...config,
      headers: {
        ...config?.headers,
        authorization: `Bearer ${access}`,
      },
    },
    {
      ...options,
      manual: true,
    },
  );
  const [, tokenRefresh] = useAxios<AuthenticationData>(
    {
      url: "/gateway/refresh",
      method: "post",
      data: { refresh },
    },
    { manual: true },
  );
  const [loading, setLoading] = useState(false);

  const apiCallWithTokenRefresh = useCallback(
    async (
      config?: AxiosRequestConfig,
      options?: RefetchOptions,
    ): Promise<AxiosResponse<T>> => {
      try {
        setLoading(true);
        const response = await apiCall(config, options);
        return response;
      } catch (error) {
        if (!isForbiddenOrNotAuthenticated(error)) {
          throw error;
        }

        try {
          console.log("Error before token refresh:", error, error?.response);

          const { data: authData } = await tokenRefresh();

          console.log("POST /gateway/refresh success:", authData);

          const response = await apiCall(
            {
              ...config,
              headers: { authorization: `Bearer ${authData.access}` },
            },
            options,
          );

          dispatch(setCurrentUserAction(authData));

          return response;
        } catch (error) {
          console.log("Error after token refresh:", error, error?.response);
          if (isForbiddenOrNotAuthenticated(error)) {
            // kick user out
            resetReduxState();
            throw new Error(
              "Your current session has expired. Please log in again.",
            );
          } else {
            throw error;
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [apiCall, tokenRefresh, dispatch],
  );

  return [{ ...responseValues, loading }, apiCallWithTokenRefresh, cancel];
}

export function useGoogleAuth() {
  const dispatch = useAppDispatch();
  const [{ loading }, login] = useAxios<AuthenticationData>(
    {
      url: "/gateway/gmail",
      method: "post",
    },
    { manual: true },
  );
  const [isUnavailable, setUnavailable] = useState(false);

  const { signIn, loaded } = useGoogleLogin({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID ?? "",
    cookiePolicy: "single_host_origin",
    onSuccess: async (
      response: GoogleLoginResponse | GoogleLoginResponseOffline,
    ) => {
      console.log("Google Client login success:", response);
      const { tokenId } = response as GoogleLoginResponse;
      const data: GmailLoginPostData = { tokenId };

      try {
        await errorHandlerWrapper(async () => {
          console.log("POST /gateway/gmail data:", data);

          const { data: authData } = await login({ data });

          console.log("POST /gateway/gmail success:", authData);

          toast.success("Signed in successfully.");

          dispatch(setCurrentUserAction(authData));
        }, "POST /gateway/gmail error:")();
      } catch (error) {
        resolveApiError(error);
      }
    },
    onFailure: (error) => {
      console.log("Google Client error:", error, error?.response);
      if (error?.error === "idpiframe_initialization_failed") {
        setUnavailable(true);
      } else if (error?.error === "popup_closed_by_user") {
        return;
      }

      toast.error(
        error?.details || error?.error || "An unknown error has occurred.",
      );
    },
  });

  return {
    startGoogleAuth: signIn,
    loading: !loaded || loading,
    isUnavailable,
  };
}

export function useCheckAccount() {
  const [{ loading }, apiCall] = useAxios<LoginDetails>(
    {
      url: "/gateway/check",
      method: "post",
    },
    { manual: true },
  );

  const checkAccount = useMemo(
    () =>
      errorHandlerWrapper(async (data: CheckAccountPostData) => {
        console.log("POST /gateway/check data:", data);

        const { data: loginDetails } = await apiCall({ data });

        console.log("POST /gateway/check success:", loginDetails);

        return loginDetails;
      }, "POST /gateway/check error:"),
    [apiCall],
  );

  return { loading, checkAccount };
}

export function usePasswordLogin() {
  const dispatch = useAppDispatch();
  const [{ loading }, login] = useAxios<AuthenticationData>(
    {
      url: "/gateway/login",
      method: "post",
    },
    { manual: true },
  );

  const passwordLogin = useCallback(
    async (data: PasswordLoginPostData) => {
      try {
        await errorHandlerWrapper(async () => {
          console.log("POST /gateway/login data:", data);

          const { data: authData } = await login({ data });

          console.log("POST /gateway/login success:", authData);

          toast.success("Signed in successfully.");

          dispatch(setCurrentUserAction(authData));
        }, "POST /gateway/login error:")();
      } catch (error) {
        resolveApiError(error);
      }
    },
    [login, dispatch],
  );

  return { loading, passwordLogin };
}
