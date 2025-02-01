
import { FluxDispatcher } from '@vendetta/metro/common';
import { before, } from "@vendetta/patcher"
import { logger } from "@vendetta"
const pluginName = "ForwardReImplementation";

function constructMessage(message, channel) {
    let msg = {
        id: '',
        type: 0,
        content: '',
        channel_id: channel.id,
        author: {
            id: '',
            username: '',
            avatar: '',
            discriminator: '',
            publicFlags: 0,
            avatarDecoration: null,
        },
        attachments: [],
        embeds: [],
        mentions: [],
        mention_roles: [],
        pinned: false,
        mention_everyone: false,
        tts: false,
        timestamp: '',
        edited_timestamp: null,
        flags: 0,
        components: [],
    };

    if (typeof message === 'string') msg.content = message;
    else msg = { ...msg, ...message };

    return msg;
};

let patches = [];

const startPlugin = () => {
    try {
        // Main patch
        const patch1 = (
            before("dispatch", FluxDispatcher, ([event]) => {
                // Reconstruct forwarded message on channel load
                if (event.type === "LOAD_MESSAGES_SUCCESS") {
                    event.messages.forEach(msg => {
                        if (Array.isArray(msg.message_snapshots) && msg.message_snapshots.length) {
                            //msg.content = JSON.stringify(msg);//msg.message_snapshots[0].message;
                            Object.assign(msg, msg.message_snapshots[0].message);
                            delete msg.message_snapshots;
                            msg.content = msg.content + "\n*(Forwarded from \nhttps://discord.com/channels/" + msg.message_reference.guild_id + "/" + msg.message_reference.channel_id + "/" + msg.message_reference.message_id + ")*";
                        }
                    });
                }
                // Reconstruct forwarded message on message creation/update
                if (event.type === "MESSAGE_CREATE" || event.type === "MESSAGE_UPDATE") {
                    if (Array.isArray(event.message.message_snapshots) && event.message.message_snapshots.length) {
                        //event.message.content = event.message.message_snapshots[0].message.content;
                        Object.assign(event.message, event.message.message_snapshots[0].message);
                        delete event.message.message_snapshots;
                        event.message.content = event.message.content + "\n*(Forwarded from \nhttps://discord.com/channels/" + event.message.message_reference.guild_id + "/" + event.message.message_reference.channel_id + "/" + event.message.message_reference.message_id + ")*";
                    }
                }
            })
        );
        patches.push(patch1);

        logger.log(`${pluginName} loaded.`);
        return null;
    } catch (err) {
        logger.log(`[${pluginName} Error]`, err);
    };
}

// Load Plugin
const onLoad = () => {
    logger.log(`Loading ${pluginName}...`);

    // Dispatch with a fake event to enable the action handlers from first loadup
    for (let type of ["MESSAGE_CREATE", "MESSAGE_UPDATE"]) {
        logger.log(`Dispatching ${type} to enable action handler.`);
        FluxDispatcher.dispatch({
            type: type,
            message: constructMessage('PLACEHOLDER', { id: '0' }),
        });
    };

    // Dispatch with a fake event to enable the action handlers from first loadup
    for (let type of ["LOAD_MESSAGES", "LOAD_MESSAGES_SUCCESS"]) {
        logger.log(`Dispatching ${type} to enable action handler.`);
        FluxDispatcher.dispatch({
            type: type,
            messages: [],
        });
    };

    // Begin patch sequence
    startPlugin();
};
onLoad();

export default {
    onLoad,
    onUnload: () => {
        logger.log(`Unloading ${pluginName}...`);
        for (let unpatch of patches) {
            unpatch();
        };
        logger.log(`${pluginName} unloaded.`);
    }
};