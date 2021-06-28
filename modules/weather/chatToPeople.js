/**
 * * Module này giúp bot chat với người lạ
 */

const Discord = require("discord.js");
const discordConfig = require("./config");
const { Client, MessageEmbed } = require("discord.js");

const Users = require("./model/user");

const client = new Client();
//* setup hook
const hook = new Discord.WebhookClient(
  discordConfig.hook.id,
  discordConfig.hook.token
);

//* login discord
client.login(discordConfig.botToken);

//* wait discord readdy
client.on("ready", () => {
  //hook.send("I am now alive!");
  console.log("readdy");
});

//* settup prefix
const prefix = discordConfig.message.prefix;


function sendMessagePrivate(id,message){
    return new Promise((resolve,reject)=>{
         client.users
           .fetch(id, false)
           .then((user) => {
             user.send(message);
           })
           .catch((err) => {
             console.log(err);
           });
    })
}



//* listen message
client.on("message", (msg) => {
  //* Kết nối 2 người đã được match trong csdl
  Users.findOne({ discordid: msg.author.id }).then((user) => {
    if (!user) {
      Users.create({
        name: msg.author.username,
        discordid: msg.author.id,
      }).then((msg) => {
        // console.log(msg);
      });
    } else {
      if (user.matchid) {
        sendMessagePrivate(user.matchid,msg.content)
      }
    }
  });

  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  try {
    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    console.log("🚀 ~ file: bot.js ~ line 42 ~ client.on ~ args", args);
    //* Bắt đầu chat
    if (args[0] == "chat") {
      Users.findOne({ discordid: msg.author.id }).then((user) => {
        console.log("Tìm người");
        if (user.matchid) {
          msg.channel.send(
            "Bạn đang trò chuyện với một người. bạn có muốn kết thúc nó. `!pp`"
          );
          return;
        }
        Users.updateOne({ discordid: msg.author.id }, { match: true }).then(
          (mg) => {
            msg.channel.send(
              "Đang tìm người nói chuyện với bạn vui lòng chờ ít phút."
            );
            //* tìm những người đang cần match và loại bỏ

            Users.find({
              match: true,
              discordid: { $ne: user.discordid },
            }).then((useron) => {
              console.log(useron);
              if (useron.length === 0) {
                msg.channel.send("Không tìm thấy một ai");
              } else {
                //   console.log(useron);
                let i = Math.floor(Math.random() * useron.length);
                //   console.log(i);
                msg.channel.send("Đã tìm thấy. Vui lòng chờ kết nối");
                Users.updateOne(
                  { discordid: msg.author.id },
                  { matchid: useron[i].discordid }
                ).then((res) => console.log(res));
                Users.updateOne(
                  { discordid: useron[i].discordid },
                  { matchid: msg.author.id }
                ).then((res) => console.log(res));
                client.users
                  .fetch(useron[i].discordid, false)
                  .then((user) => {
                    user.send("Đã tìm thấy");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            });
          }
        );
      });
    }
    if (args[0] == "pp") {
      msg.channel.send("Kết thúc trò chuyện");
      Users.findOne({ discordid: msg.author.id, match: true }).then((user) => {
        Users.updateOne(
          { discordid: user.discordid },
          { match: false, matchid: "" }
        ).then((msg) => {
          console.log(msg);
        });
        client.users
          .fetch(user.matchid, false)
          .then((user) => {
            user.send("Kết thúc trò chuyện");
          })
          .catch((err) => {
            console.log(err);
          });
        Users.updateOne(
          { discordid: user.matchid },
          { match: false, matchid: "" }
        ).then((msg) => {
          console.log(msg);
        });
      });
    }
  } catch {
    msg.channel.send("command not found");
  }
});
//#endregion
