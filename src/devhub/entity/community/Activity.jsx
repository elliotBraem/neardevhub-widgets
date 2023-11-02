const { handle } = props;

const { getCommunity } = VM.require(
  "${REPL_DEVHUB}/widget/core.adapter.devhub-contract"
);

const { href } = VM.require("${REPL_DEVHUB}/widget/core.lib.url");

if (!getCommunity || !href) {
  return <p>Loading modules...</p>;
}

// TODO: Why do we need to get community data again? Isn't the tag the handle...
const communityData = getCommunity({ handle });

if (communityData === null) {
  return <div>Loading...</div>;
}

const MainContent = styled.div`
  max-width: 73.5%;

  @media screen and (max-width: 960px) {
    max-width: 100%;
  }
`;

const SidebarContainer = styled.div`
  max-width: 25%;

  @media screen and (max-width: 960px) {
    display: none;
  }
`;

const FeedHeader = styled.div`
  background: white;
  padding: 0 3rem;

  @media screen and (max-width: 960px) {
    padding: 0 1rem;
  }
`;

function PostCard(postId) {
  return (
    <div className="py-2" style={{ minHeight: "150px" }}>
      <Widget
        src={"${REPL_DEVHUB}/widget/devhub.entity.post.Post"}
        props={{
          id: postId,
          expandable: true,
          defaultExpanded: false,
          isInList: true,
          draftState,
          isPreview: false,
          referral: postId,
        }}
      />
    </div>
  );
}

return (
  <div style={{ maxWidth: "100%" }}>
    <FeedHeader>
      <div
        className="my-4 d-flex align-items-center justify-content-between"
        style={{ gap: "2.5rem" }}
      >
        <div class="d-flex align-items-center justify-content-between">
          <small class="text-muted">
            <span>Required tags:</span>
            <Link
              to={href({
                widgetSrc: "${REPL_DEVHUB}/widget/app",
                params: { page: "feed", tag: community.tag },
              })}
            >
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.components.atom.Tag"}
                props={{
                  tag: community.tag,
                }}
              />
            </Link>
          </small>
        </div>
        {context.accountId && (
          <Widget
            src={
              "${REPL_DEVHUB}/widget/devhub.components.molecule.PostControls"
            }
            props={{
              title: "Post",
              href: href({
                widgetSrc: "${REPL_DEVHUB}/widget/app",
                params: {
                  page: "create",
                  labels: [community.tag],
                },
              }),
            }}
          />
        )}
      </div>
    </FeedHeader>
    <div className="col">
      <div className="d-flex w-100">
        <MainContent>
          <div className="row w-100">
            <div className="col">
              <Widget
                src={"${REPL_DEVHUB}/widget/devhub.entity.addon.blog.Feed"}
                props={{
                  includeLabels: [handle],
                  // excludeLabels: ["blog"],
                  renderItem: PostCard,
                  Layout: (children) => children,
                }}
              />
            </div>
          </div>
        </MainContent>
        <SidebarContainer>
          <Widget
            src={"${REPL_DEVHUB}/widget/devhub.entity.community.Sidebar"}
            props={{ community: communityData }}
          />
        </SidebarContainer>
      </div>
    </div>
  </div>
);
