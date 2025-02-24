"use client";

import { useEffect, useState } from "react";
import { getUsers, getUsersCount } from "../actions";
import { Skeleton } from "~/components/ui/skeleton";
import { Button } from "~/components/ui/button";

type User = Awaited<ReturnType<typeof getUsers>>[number];

export default function AdminServersPage() {
  const [page, setPage] = useState(0);
  const [pagesCount, setPagesCount] = useState(1);
  const [users, setUsers] = useState<User[] | undefined>(undefined);

  const PAGE_SIZE = 20;

  useEffect(() => {
    getUsersCount().then((n) => setPagesCount(Math.ceil(n / PAGE_SIZE)));
  }, []);

  useEffect(() => {
    setUsers(undefined);
    getUsers(page, PAGE_SIZE).then(setUsers);
  }, [page]);

  return (
    <div className="flex w-full flex-col gap-6 lg:p-8">
      <h1 className="mb-4 text-[32px] font-bold leading-tight tracking-normal text-foreground">
        Пользователи
      </h1>
      <div className="flex flex-row gap-2">
        {new Array(pagesCount).fill(0).map((_, i) => (
          <Button
            variant={i === page ? "filled" : "text"}
            size="sm"
            onClick={(e) => setPage(i)}
            key={`page-${i}`}
          >
            {i + 1}
          </Button>
        ))}
      </div>
      <div className="flex grid-cols-[repeat(auto-fill,_minmax(330px,1fr))] flex-col gap-4 md:grid md:[&_>div]:max-w-[470px]">
        {!users ? (
          <>
            <Skeleton className="h-[58px] rounded-[8px]" />
            <Skeleton className="h-[58px] rounded-[8px]" />
            <Skeleton className="h-[58px] rounded-[8px]" />
            <Skeleton className="h-[58px] rounded-[8px]" />
          </>
        ) : (
          users.map((u) => <UserRow key={u.id} user={u} />)
        )}
      </div>
    </div>
  );
}

function UserRow({ user }: { user?: User }) {
  if (!user) return <></>;

  return (
    <div
      // href={`/dashboard/admin/users/${u.id}`}
      key={user.id}
      className="flex place-items-center gap-4 rounded-[8px] px-4 py-2 hover:bg-primary/5"
    >
      <img
        src={user.avatarUrl}
        alt={user.nickname ?? "user avatar"}
        loading="eager"
        width={40}
        height={40}
        className="rounded-[4px]"
      />
      <div className="flex flex-col [&_span]:leading-tight">
        <span className="text-[18px] font-medium text-foreground">
          {user.nickname ?? "--"}
        </span>
        <span className="text-muted-foreground">{user.account}</span>
      </div>
    </div>
  );
}
