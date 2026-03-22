import AnnouncementCard from "./AnnouncementCard";

function AnnouncementFeed({ posts }) {
  if (!posts.length) {
    return <p className="bp-muted">No announcements yet.</p>;
  }

  return (
    <div className="bp-announcement-timeline">
      {posts.map((post, index) => (
        <AnnouncementCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}

export default AnnouncementFeed;
