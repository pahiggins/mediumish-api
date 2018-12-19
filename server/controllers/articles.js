const connection = require('../../db/connection');

exports.getArticles = (req, res, next) => {
  const {
    limit = 10,
    sort_by = 'created_at',
    p = 0,
    sort_ascending = false,
  } = req.query;

  return connection
    .select(
      'articles.username AS author',
      'articles.title',
      'articles.article_id',
      'articles.body',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
    )
    .limit(limit)
    .offset(p * limit)
    .orderBy((`articles.${sort_by}`), sort_ascending ? 'asc' : 'desc')
    .count('comments.article_id AS comment_count')
    .from('comments')
    .rightJoin('articles', 'articles.article_id', '=', 'comments.article_id')
    .groupBy(
      'articles.username',
      'articles.title',
      'articles.article_id',
      'articles.body',
      'articles.votes',
      'articles.created_at',
      'articles.topic',
      'comments.article_id',
    )
    .then(matchingArticles => res.status(200).send(matchingArticles))
    .catch(next);
};

exports.getArticle = (req, res, next) => connection
  .select(
    'articles.username AS author',
    'articles.title',
    'articles.article_id',
    'articles.body',
    'articles.votes',
    'articles.created_at',
    'articles.topic',
  )
  .count('comments.article_id AS comment_count')
  .from('comments')
  .rightJoin('articles', 'articles.article_id', '=', 'comments.article_id')
  .groupBy(
    'articles.username',
    'articles.title',
    'articles.article_id',
    'articles.body',
    'articles.votes',
    'articles.created_at',
    'articles.topic',
    'comments.article_id',
  )
  .then(([matchingArticles]) => res.status(200).send(matchingArticles))
  .catch(next);
