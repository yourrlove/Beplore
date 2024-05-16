const { io, connectedClients } = require("../socket/socket");
const User = require("./user.model");
const Comment = require("./comment.model");
const Post = require("./post.model");
const mongoose = require("mongoose"); // Erase if already required
const { Schema } = mongoose;

// Declare the Schema of the Mongo model
const notificationSchema = new Schema(
  {
    source: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      userName: {
        type: String,
        required: true,
        default: null,
      },
      avatar: {
        type: String,
        required: false,
        default: null,
      },
    },
    target: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: false,
      },
      commentId: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: false,
      },
    },
    type: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      MaxLength: 500,
    },
    isRead: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

const changeStream = Notification.watch();
changeStream.on("change", async (change) => {
  if ( change.operationType === "insert" ) {
      if (connectedClients[change.fullDocument.target.userId]) {
        console.log(`send to ${connectedClients[change.fullDocument.target.userId]}`);
        io.to(connectedClients[change.fullDocument.target.userId]).emit("notifications", change.fullDocument);
      }
  }
});

changeStream.on("error", (error) => {
  console.error("Error in change stream:", error);
});

//Export the model
module.exports = Notification;
