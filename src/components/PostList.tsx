import { useState, useEffect } from 'react';
import { Table, type TableColumn } from '@consta/uikit/Table';
import { Select } from '@consta/uikit/Select';
import { Loader } from '@consta/uikit/Loader';
import { Text } from '@consta/uikit/Text';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { Post } from '../types/gorest';
import { Button } from '@consta/uikit/Button';

type PostRow = Omit<Post, 'id'> & { id: string };

const itemsPerPageOptions = [
  { label: '10', value: '10' },
  { label: '25', value: '25' },
  { label: '50', value: '50' },
];

export const PostList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostRow[]>([]); 
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(itemsPerPageOptions[0]);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/posts', {
        params: { page, per_page: perPage.value }
      });
      const pagesCount = Number(response.headers['x-pagination-pages']);
      setTotalPages(pagesCount);

      setTotalPages(parseInt(response.headers['x-pagination-pages'] || '1'));

      const formattedPosts: PostRow[] = response.data.map((post: Post) => ({
        ...post,
        id: post.id.toString(),
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Ошибка загрузки постов', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, perPage]);

  const columns: TableColumn<PostRow>[] = [
    { title: 'ID', accessor: 'id' },
    { title: 'Заголовок', accessor: 'title' },
  ];

  if (loading && posts.length === 0) return <Loader />;

  return (
    <div>
      <Table
        rows={posts}
        columns={columns}
        onRowClick={({ id }) => navigate(`/post/${id}`)}
        borderBetweenColumns
        borderBetweenRows
      />
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', minHeight: '50px'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button
            label="Назад"
            view="ghost"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          />
          <Text>Страница {page} из {totalPages}</Text>
          <Button
            label="Вперед"
            view="ghost"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Select
            size="s"
            items={itemsPerPageOptions}
            value={perPage}
            onChange={(val) => {
              setPerPage(val || itemsPerPageOptions[0]);
              setPage(1);
            }}
            style={{ width: '80px' }}
            getItemKey={function (_item: { label: string; value: string; }): string | number {
              return _item.value;
            }}
          />
        </div>
      </div>
    </div>
  );
};