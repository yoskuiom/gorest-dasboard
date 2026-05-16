import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@consta/uikit/Card';
import { Button } from '@consta/uikit/Button';
import { Text } from '@consta/uikit/Text';
import { Layout } from '@consta/uikit/Layout';
import { Badge } from '@consta/uikit/Badge';
import { Loader } from '@consta/uikit/Loader';
import api from '../api';
import type { User } from '../types/gorest';

export const UserPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(res => setUser(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!user) return <Text>Пользователь не найден</Text>;

  return (<div className="content-wrapper"><Layout direction="column" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
    <Button
      label="Назад к списку"
      view="ghost"
      onClick={() => navigate('/')}
      style={{ alignSelf: 'flex-start', marginBottom: '20px' }}
    />

    <Card verticalSpace="xl" horizontalSpace="xl" shadow>
      <Text size="3xl" weight="bold" style={{ marginBottom: '12px' }}>{user.name}</Text>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Text view="secondary">Email: <Text as="span" view="primary">{user.email}</Text></Text>
        <Text view="secondary">Пол: <Text as="span" view="primary">{user.gender}</Text></Text>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Text view="secondary">Статус:</Text>
          <Badge
            label={user.status}
            status={user.status === 'active' ? 'success' : 'error'}
          />
        </div>
      </div>
    </Card>
  </Layout>
  </div>
  );
};