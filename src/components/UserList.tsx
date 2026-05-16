import { useState, useEffect } from 'react';
import { Table, type TableColumn } from '@consta/uikit/Table';
import { Select } from '@consta/uikit/Select';
import { Loader } from '@consta/uikit/Loader';
import { Text } from '@consta/uikit/Text';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import type { User } from '../types/gorest';
import { Button } from '@consta/uikit/Button';

type UserRow = User & {
  id: string;
  firstName: string;
  lastName: string;
};

const itemsPerPageOptions = [
  { label: '10', value: '10' },
  { label: '25', value: '25' },
  { label: '50', value: '50' },
];

export const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(itemsPerPageOptions[0]);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users', {
        params: { page, per_page: perPage.value }
      });
      const pages = parseInt(response.headers['x-pagination-pages'] || '1');
      setTotalPages(pages);
      const pagesCount = Number(response.headers['x-pagination-pages']);

      setTotalPages(pagesCount);

      const formattedUsers = response.data.map((user: User) => {
        const nameParts = user.name.split(' ');
        return {
          ...user,
          id: String(user.id),
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '-',
        };
      });

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Ошибка при загрузке пользователей', error);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchUsers();
  }, [page, perPage]);

  const columns: TableColumn<UserRow>[] = [
    { title: 'Имя', accessor: 'firstName', sortable: true },
    { title: 'Фамилия', accessor: 'lastName', sortable: true },
    { title: 'Email', accessor: 'email' },
  ];

  if (loading && users.length === 0) return <Loader />;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Table
          rows={users}
          columns={columns}
          borderBetweenColumns
          borderBetweenRows
          onRowClick={({ id }) => navigate(`/user/${id}`)}
        />
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '50px'
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