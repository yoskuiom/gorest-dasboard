import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@consta/uikit/Card';
import { Button } from '@consta/uikit/Button';
import { Text } from '@consta/uikit/Text';
import { Layout } from '@consta/uikit/Layout';
import { Loader } from '@consta/uikit/Loader';
import api from '../api';
import type { Post, Comment } from '../types/gorest';

export const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/posts/${id}`),
      api.get(`/posts/${id}/comments`)
    ])
      .then(([postRes, commentsRes]) => {
        setPost(postRes.data);
        setComments(commentsRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!post) return <Text>Пост не найден</Text>;

  return (
    <div className="content-wrapper"><Layout direction="column" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <Button
        label="Назад к списку"
        view="ghost"
        onClick={() => navigate('/')}
        style={{ alignSelf: 'flex-start', marginBottom: '20px' }}
      />

      <Card verticalSpace="xl" horizontalSpace="xl" shadow style={{ marginBottom: '30px' }}>
        <Text size="2xl" weight="bold" style={{ marginBottom: '16px' }}>{post.title}</Text>
        <Text size="l" view="secondary">{post.body}</Text>
      </Card>

      <Text size="xl" weight="bold" style={{ marginBottom: '16px' }}>
        Комментарии ({comments.length})
      </Text>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {comments.length > 0 ? (
          comments.map(comment => (
            <Card key={comment.id} verticalSpace="m" horizontalSpace="m">
              <Text weight="bold" size="s">{comment.name}</Text>
              <Text size="xs" view="ghost" style={{ marginBottom: '8px' }}>{comment.email}</Text>
              <Text size="s">{comment.body}</Text>
            </Card>
          ))
        ) : (
          <Text view="secondary">К этому посту пока нет комментариев.</Text>
        )}
      </div>
    </Layout>
    </div>

  );
};