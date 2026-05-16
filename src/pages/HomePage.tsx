import { useState } from 'react';
import { useAuth } from '../context/authContext';
import { TextField } from '@consta/uikit/TextField';
import { Button } from '@consta/uikit/Button';
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup';
import { Layout } from '@consta/uikit/Layout';
import { Card } from '@consta/uikit/Card';
import { Text } from '@consta/uikit/Text';
import { UserList } from '../components/UserList';
import { PostList } from '../components/PostList';
import api from '../api';
import { Informer } from '@consta/uikit/Informer';

const modes: ('users' | 'posts')[] = ['users', 'posts'];

export const HomePage = () => {
  const { token, setToken, mode, setMode, logout } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    try {
      await api.get('/users', {
        headers: { Authorization: `Bearer ${inputValue.trim()}` }
      });
      setToken(inputValue.trim());
    } catch (error: any) {
      if (error.response?.status === 401) {
        setLoginError('Неверный Access Token. Сервер отклонил запрос.');
      } else {
        setLoginError('Ошибка при проверке токена. Проверьте интернет.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Card verticalSpace="xl" horizontalSpace="xl" shadow style={{ width: '400px' }}>
          <Text size="l" weight="bold" style={{ marginBottom: '16px' }}>Введите Access Token</Text>
          {loginError && (
            <Informer
              status="alert"
              view="filled"
              title="Ошибка доступа"
              label={loginError}
              style={{ marginBottom: '16px' }}
            />
          )}

          <TextField
            placeholder="Ваш токен GoRest"
            value={inputValue}
            onChange={(value) => {
              setInputValue(value || '');
              if (loginError) setLoginError(null);
            }}
            status={loginError ? 'alert' : (inputValue === '' ? 'warning' : undefined)}
            style={{ marginBottom: '20px' }}
          />
          <Button
            label={isLoading ? 'Проверка...' : 'Войти'}
            width="full"
            onClick={handleLogin}
            loading={isLoading}
            disabled={!inputValue.trim() || isLoading}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="content-wrapper"><Layout direction="column" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card verticalSpace="m" horizontalSpace="m" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <ChoiceGroup
              value={mode}
              onChange={(value) => setMode(value)}
              items={modes}
              getItemLabel={(item: string) => item === 'users' ? 'Пользователи' : 'Посты'}
              name="ModeSwitcher"
              multiple={false}
            />
          </div>
          <Button label="Выйти" view="ghost" size="s" onClick={logout} />
        </div>
      </Card>

      <Card verticalSpace="xl" horizontalSpace="xl">
        <Text size="xl">
          {mode === 'users' ? 'Список пользователей' : 'Список постов'}
        </Text>
      </Card>

      <Card verticalSpace="xl" horizontalSpace="xl" shadow>
        {mode === 'users' ? <UserList /> : <PostList />}
      </Card>
    </Layout>
    </div>
  );
};