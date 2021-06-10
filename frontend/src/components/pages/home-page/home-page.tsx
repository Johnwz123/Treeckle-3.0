import { useEffect } from "react";
import clsx from "clsx";
import { useMediaQuery } from "react-responsive";
import {
  Transition,
  Image,
  Button,
  Segment,
  Container,
  Divider,
  Grid,
} from "semantic-ui-react";
import { useAppDispatch } from "../../../redux/hooks";
import { updateCurrentUser } from "../../../redux/slices/current-user-slice";
import useShowScroller from "../../../custom-hooks/use-show-scroller";
import SignInButton from "../../sign-in-button";
import treeckleLogo from "../../../assets/treeckle-outline-min.png";
import treeckleVideo from "../../../assets/utown-video.mp4";
import styles from "./home-page.module.scss";

function HomePage() {
  const dispatch = useAppDispatch();
  const isTabletOrLarger = useMediaQuery({ query: "(min-width: 768px)" });
  const { showScroller } = useShowScroller(300);

  useEffect(() => {
    dispatch(updateCurrentUser(null));
  }, [dispatch]);

  return (
    <div className={styles.homePage}>
      <div className={styles.homeBanner}>
        <Transition animation="scale" transitionOnMount>
          <div className={styles.headerContainer}>
            <Image className={styles.logo} src={treeckleLogo} alt="" />
            <h1 className={styles.title}>TREECKLE</h1>
            <p className={styles.subtitle}>Residential life. Simplified.</p>
            <SignInButton />
          </div>
        </Transition>
        {isTabletOrLarger && (
          <div className={styles.videoContainer}>
            <video autoPlay loop muted playsInline src={treeckleVideo} />
          </div>
        )}
      </div>

      <Segment
        textAlign="center"
        className={styles.highlightsContainer}
        vertical
      >
        <Container>
          <h1 className={styles.title}>
            THE INTEGRATED PLATFORM THAT SERVES YOUR NEEDS
          </h1>
          <Grid columns="3" centered stackable relaxed padded="vertically">
            <Grid.Column textAlign="center">
              <i className="fas fa-home fa-6x" />
              <h3>FACILITIES BOOKING</h3>
              <p>
                Redefined by Treeckle, booking facilities and approvals can now
                be done seamlessly
              </p>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <i className="far fa-calendar-alt fa-6x" />
              <h3>COLLEGE EVENTS</h3>
              <p>
                Digitized events are easier than ever to find, and simplifies
                creation for event organizers
              </p>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <i className="far fa-infinity fa-6x" />
              <h3>THE SKY'S THE LIMIT</h3>
              <p>You get to decide what we build next</p>
            </Grid.Column>
          </Grid>
        </Container>
      </Segment>

      <Segment
        textAlign="center"
        className={clsx(styles.missionContainer, styles.important)}
        vertical
      >
        <Container className={styles.mission}>
          <h1>MISSION</h1>
          <p>
            At Treeckle, we believe in creating scalable digital experiences to
            enhance the Residential College experience at NUS.
          </p>
        </Container>
      </Segment>

      <Segment textAlign="center" className={styles.visionContainer} vertical>
        <Container>
          <div className={styles.title}>
            <h1>VISION</h1>
            <p>
              To empower each and every resident with technology to be able to
              achieve their goals with greater efficiency.
            </p>
          </div>

          <Grid columns="3" centered stackable relaxed padded="vertically">
            <Grid.Column textAlign="center">
              <h1>
                200+
                {/* {isLoading ? (
                  <Loader active inline size="medium" />
                ) : (
                  <div ref={ref}>{value}</div>
                )} */}
              </h1>
              <p>Facility bookings facilitated in total</p>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <h1>User-Specific</h1>
              <p>Events subscription system</p>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <h1>Deployable</h1>
              <p>Across all five Residential Colleges</p>
            </Grid.Column>
          </Grid>
        </Container>
      </Segment>

      <Segment textAlign="center" inverted vertical className={styles.footer}>
        <Container>
          <Grid columns="2" centered stackable padded="vertically">
            <Grid.Column textAlign="center">
              <h2>ABOUT TREECKLE</h2>
              <p>
                Treeckle is an ex-
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://www.cs3216.com/"
                >
                  CS3216
                </a>{" "}
                project, built with the aim of making a difference through a web
                application.
              </p>
            </Grid.Column>
            <Grid.Column textAlign="center">
              <h2>CONTACT US</h2>
              <p>
                <a href="mailto:treeckle@googlegroups.com">
                  <i className="fas fa-envelope icon" />
                  Email
                </a>
              </p>
            </Grid.Column>
          </Grid>
          <Divider className={clsx(styles.divider, styles.important)} section />
          <p>© Treeckle 2021</p>
        </Container>
      </Segment>

      <Transition visible={showScroller} animation="scale" duration="300">
        <Button
          className={clsx(styles.scrollToTopButton, styles.important)}
          color="teal"
          onClick={() =>
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
          }
          icon={<i className="fas fa-arrow-up icon" />}
          circular
          size="massive"
          aria-label="scroll to top"
        />
      </Transition>
    </div>
  );
}

export default HomePage;
