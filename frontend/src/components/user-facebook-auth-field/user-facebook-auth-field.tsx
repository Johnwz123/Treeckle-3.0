import { Button } from "semantic-ui-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  selectCurrentUserDisplayInfo,
  updateCurrentUserAction,
} from "../../redux/slices/current-user-slice";
import { useFacebookAuth } from "../../custom-hooks/api/auth-api";
import { useUpdateSelf } from "../../custom-hooks/api/users-api";
import HorizontalLayoutContainer from "../horizontal-layout-container";
import { resolveApiError } from "../../utils/error-utils";
import { SelfPatchAction } from "../../types/users";

const LinkButton = () => {
  const dispatch = useAppDispatch();
  const { loading: isLinking, updateSelf } = useUpdateSelf();

  const onFacebookLogin = async (response: fb.StatusResponse) => {
    const { accessToken } = response.authResponse;

    try {
      const updatedSelf = await updateSelf({
        action: SelfPatchAction.Facebook,
        payload: { accessToken },
      });

      if (updatedSelf.isSelf) {
        toast.success("Your facebook account has been successfully linked.");

        dispatch(updateCurrentUserAction({ user: updatedSelf }));
      }
    } catch (error) {
      resolveApiError(error);
    }
  };

  const { startFacebookAuth } = useFacebookAuth(onFacebookLogin);

  return (
    <Button
      size="mini"
      compact
      color="blue"
      content="Link"
      loading={isLinking}
      onClick={startFacebookAuth}
      disabled={isLinking}
    />
  );
};

const UnlinkButton = () => {
  const dispatch = useAppDispatch();
  const { loading: isUnlinking, updateSelf } = useUpdateSelf();

  const onUnlinkFacebook = async () => {
    if (isUnlinking) {
      return;
    }

    try {
      const updatedSelf = await updateSelf({
        action: SelfPatchAction.Facebook,
        payload: null,
      });

      if (updatedSelf.isSelf) {
        toast.success("Your facebook account has been successfully unlinked.");

        dispatch(updateCurrentUserAction({ user: updatedSelf }));

        window.FB?.getLoginStatus(({ status }) => {
          status === "connected" && window.FB?.logout();
        });
      }
    } catch (error) {
      resolveApiError(error);
    }
  };

  return (
    <Button
      size="mini"
      compact
      color="blue"
      content="Unlink"
      loading={isUnlinking}
      onClick={onUnlinkFacebook}
      disabled={isUnlinking}
    />
  );
};

type Props = {
  labelClassName?: string;
};

function UserFacebookAuthField({ labelClassName }: Props) {
  const { facebookAuth } = useAppSelector(selectCurrentUserDisplayInfo) ?? {};

  return (
    <HorizontalLayoutContainer spacing="compact" align="center">
      <span className={labelClassName}>
        {facebookAuth ? "Linked" : "Not linked"}
      </span>

      {facebookAuth ? (
        <>
          <span>{`(${facebookAuth.email})`}</span>
          <UnlinkButton />
        </>
      ) : (
        <LinkButton />
      )}
    </HorizontalLayoutContainer>
  );
}

export default UserFacebookAuthField;
