const LandingPage = ({ currentUser }) => (
  currentUser
    ? <h1>You are signed in </h1>
    : <h1>You are not sign in</h1>
);

LandingPage.getInitialProps = async (context, client, currentUser) => ({});

export default LandingPage;
