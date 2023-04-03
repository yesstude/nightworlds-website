import {
  Box,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { api } from "../../../utils/api";

export default function FriendsPlayingCard() {
  const [t, i18n, tr] = useTranslation("dashboard");

  const friends = api.me.friendsOnline.useQuery();

  let list = (
    <Typography component="div">
      {t("homepage.friends_online.nofriends")}
    </Typography>
  );
  if (friends.data) {
    list = (
      <Typography component="div">
        {t("homepage.friends_online.nofriendsonline", {
          friendslink: t("homepage.friends_online.friendslink"),
        })}
      </Typography>
    );
    if (friends.data.length > 0)
      list = (
        <List>
          {friends.data.map((friend, i) => {
            if (i == 3)
              return (
                <Typography component="div">
                  {t("homepage.friends_online.andmore")}
                </Typography>
              );
            if (i > 3) return <></>;
            return (
              <ListItem disablePadding key={friend.nickname}>
                <ListItemAvatar
                  sx={{
                    minWidth: "44px",
                    pt: "4px",
                  }}
                >
                  <img
                    style={{
                      borderRadius: "4px",
                    }}
                    src={friend.avatar}
                    alt={`${friend.nickname}'s avatar`}
                    width="32"
                    height="32"
                  />
                </ListItemAvatar>
                <ListItemText>
                  {friend.nickname} · {friend.server}
                </ListItemText>
              </ListItem>
            );
          })}
        </List>
      );
  }

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        placeItems: "center",
        flexWrap: "wrap-reverse",
        gap: "32px",
        textAlign: "left",
      }}
    >
      <Box>
        <Typography variant="body2" component="div">
          {t("homepage.friends_online.title")}
        </Typography>
        <Typography component="div" sx={{ mb: "16px" }}>
          {t("homepage.friends_online.subtitle")}
        </Typography>
        {list}
      </Box>
    </Card>
  );
}
