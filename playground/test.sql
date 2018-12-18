\c northcoders_news_test;

SELECT
articles.username AS author,
articles.title,
articles.article_id,
articles.votes,
COUNT(comments.article_id) AS comment_count,
articles.created_at,
articles.topic
FROM comments
RIGHT JOIN articles
ON articles.article_id = comments.article_id
GROUP BY
articles.username,
articles.title,
articles.article_id,
articles.votes,
comments.article_id,
articles.created_at,
articles.topic;