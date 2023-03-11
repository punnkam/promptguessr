import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const UserStats = () => {
  const { data: session, status } = useSession();
  const [rank, setRank] = useState<number>();
  const [score, setScore] = useState<string>();
  const [solved, setSolved] = useState<number>();

  useEffect(() => {
    if (status !== 'authenticated') return;
    const user: any = session?.user;
    axios
      .get(`/api/getUserStats?email=${user.email}`)
      .then((res) => {
        console.log(res.data);
        setRank(res.data.rank);
        setScore(res.data.score);
        setSolved(res.data.solved);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [session, status]);

  return (
    <div>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Rank: {rank}</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Score: {score}</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>
            Solved: {solved}
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default UserStats;
