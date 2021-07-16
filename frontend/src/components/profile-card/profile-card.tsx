import { capitalCase } from "change-case";
import { Grid, Segment, Image, Divider } from "semantic-ui-react";
import { displayDateTime } from "../../utils/parser-utils";
import { UserData } from "../../types/users";
import UserAuthSection from "../user-auth-section";
import UserSelfProvider from "../../contexts/user-self-provider";
import defaultAvatarImage from "../../assets/avatar.png";
import styles from "./profile-card.module.scss";

type Props = UserData;

function ProfileCard({
  profileImage,
  name,
  email,
  organization,
  role,
  createdAt,
  isSelf,
}: Props) {
  return (
    <Segment className={styles.profileCard} raised padded>
      <Grid columns="2" relaxed="very" padded stackable doubling>
        <Grid.Column width="6" verticalAlign="middle">
          <Image
            src={profileImage || defaultAvatarImage}
            className={styles.avatar}
            bordered
            alt=""
            centered
            fluid
          />
        </Grid.Column>
        <Grid.Column width="10">
          <h2>{name}</h2>

          <Divider hidden />

          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Organization:</strong> {organization}
          </p>
          <p>
            <strong>Role:</strong> {capitalCase(role)}
          </p>
          <p>
            <strong>Joined in:</strong>{" "}
            {displayDateTime(createdAt, "MMMM yyyy")}
          </p>

          <Divider hidden />

          {isSelf && (
            <UserSelfProvider>
              <UserAuthSection />
            </UserSelfProvider>
          )}
        </Grid.Column>
      </Grid>
    </Segment>
  );
}

export default ProfileCard;
