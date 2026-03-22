function AnnouncementCard({ post, index = 0 }) {
  return (
    <article
      className="bp-announcement-card bp-fade-stagger"
      style={{ animationDelay: `${Math.min(index * 70, 420)}ms` }}
    >
      <h4 className="bp-announcement-title">{post.title}</h4>
      <p className="bp-announcement-content">{post.content}</p>
      <p className="bp-announcement-meta">
        {post.authorName} · {new Date(post.createdAt).toLocaleString()}
      </p>
    </article>
  );
}

export default AnnouncementCard;
