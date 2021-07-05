import {
  EMAIL,
  EMAILS,
  ID,
  NAME,
  ORGANIZATION,
  PROFILE_IMAGE,
  ROLE,
  STATUS,
} from "../constants";
import { BaseData } from "./base";

export enum Role {
  Admin = "ADMIN",
  Organizer = "ORGANIZER",
  Resident = "RESIDENT",
}

export const userRoles = Object.values(Role);

export type UserInviteData = BaseData & {
  [EMAIL]: string;
  [ROLE]: Role;
  [ORGANIZATION]: string;
};

export type UserData = UserInviteData & {
  [NAME]: string;
  [PROFILE_IMAGE]: string;
};

export type UserInvitePostData = {
  [EMAIL]: string;
  [ROLE]: Role;
};

export type UserInvitePatchData = {
  [ROLE]: Role;
};

export type UserPatchData = {
  [NAME]?: string;
  [EMAIL]?: string;
  [ROLE]?: Role;
};

export enum UserCreationStatus {
  New = "NEW",
  Created = "CREATED",
  Duplicate = "DUPLICATE",
  Invalid = "INVALID",
}

export const userCreationStatuses = Object.values(UserCreationStatus);

export const USER_CREATION_STATUS_DETAILS = new Map<
  UserCreationStatus,
  { description: string; classType: string }
>([
  [
    UserCreationStatus.New,
    {
      description:
        "Newly added user entry which has yet to be submitted for creation.",
      classType: "",
    },
  ],
  [
    UserCreationStatus.Created,
    { description: "Newly created user.", classType: "positive" },
  ],
  [
    UserCreationStatus.Duplicate,
    { description: "Duplicate user emails found.", classType: "warning" },
  ],
  [
    UserCreationStatus.Invalid,
    {
      description:
        "User has invalid details or user already exists in the system.",
      classType: "negative",
    },
  ],
]);

export type PendingCreationUser = {
  [ID]: number;
  [EMAIL]: string;
  [ROLE]: Role;
  [STATUS]: UserCreationStatus;
};

export type UserCreationFormProps = {
  [ROLE]: Role.Resident;
  [EMAILS]: string;
};

export type UserCreationCsvRowData = [string, string];
