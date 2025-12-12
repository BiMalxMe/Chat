import { useNavigate } from 'react-router';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    document.cookie = 'tokenForChatauth=; path=/; max-age=0';
    document.cookie = 'name=; path=/; max-age=0';
    document.cookie = 'email=; path=/; max-age=0';
    navigate('/signin');
  };

  return logout;
};
