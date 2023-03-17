import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const UserStats = () => {
    const { data: session, status } = useSession();
    const [rank, setRank] = useState<number>();
    const [score, setScore] = useState<string>();
    const [solved, setSolved] = useState<number>();
    const [stats, setStats] = useState<any>({});

    useEffect(() => {
        if (status !== 'authenticated') return;
        const user: any = session?.user;
        axios
            .get(`/api/getUserStats?email=${user.email}`)
            .then((res) => {
                console.log(res.data);
                setStats({
                    rank: res.data.rank,
                    score: res.data.score,
                    solved: res.data.solved,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, [session, status, stats]);

    return (
        <div>
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger>Rank: {stats && stats.rank}</MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>
                        Score: {stats && stats.score}
                    </MenubarTrigger>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>
                        Solved: {stats && stats.solved}
                    </MenubarTrigger>
                </MenubarMenu>
            </Menubar>
        </div>
    );
};

export default UserStats;
