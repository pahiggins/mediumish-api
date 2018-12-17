function timeConverter(UNIX_timestamp) {
  const a = new Date(UNIX_timestamp * 1000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  const time = `${date} ${month} ${year} ${hour}:${min}:${sec}`;
  return time;
}

exports.formatArticleData = articles => articles.map(
  ({ created_by, created_at, ...article }) => ({
    username: created_by,
    created_at: timeConverter(created_at),
    ...article,
  }),
);

exports.formatCommentData = (comments, articles) => comments.map(({
  belongs_to,
  created_by,
  created_at,
  ...comment
}) => {
  const matchingArticle = articles.filter(article => article.title === belongs_to);

  return {
    username: created_by,
    article_id: matchingArticle[0].article_id,
    created_at: timeConverter(created_at),
    ...comment,
  };
});
