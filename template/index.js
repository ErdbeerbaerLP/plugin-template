(function(a){"use strict";const n="ForwardReImplementation";function c(t,o){let e={id:"",type:0,content:"",channel_id:o.id,author:{id:"",username:"",avatar:"",discriminator:"",publicFlags:0,avatarDecoration:null},attachments:[],embeds:[],mentions:[],mention_roles:[],pinned:!1,mention_everyone:!1,tts:!1,timestamp:"",edited_timestamp:null,flags:0,components:[]};return typeof t=="string"?e.content=t:e={...e,...t},e}let r=[];const i=function(){try{const t=vendetta.patcher.before("dispatch",vendetta.metro.common.FluxDispatcher,function(o){let[e]=o;e.type==="LOAD_MESSAGES_SUCCESS"&&e.messages.forEach(function(s){Array.isArray(s.message_snapshots)&&s.message_snapshots.length&&(Object.assign(s,s.message_snapshots[0].message),delete s.message_snapshots,s.content=s.content+`(Forwarded from 
https://discord.com/channels/`+s.message_reference.guild_id+"/"+s.message_reference.channel_id+"/"+s.message_reference.message_id+")")}),(e.type==="MESSAGE_CREATE"||e.type==="MESSAGE_UPDATE")&&Array.isArray(e.message.message_snapshots)&&e.message.message_snapshots.length&&(Object.assign(e.message,e.message.message_snapshots[0].message),delete e.message.message_snapshots,e.message.content=e.message.content+`(Forwarded from 
https://discord.com/channels/`+e.message.message_reference.guild_id+"/"+e.message.message_reference.channel_id+"/"+e.message.message_reference.message_id+")")});return r.push(t),vendetta.logger.log(`${n} loaded.`),null}catch(t){vendetta.logger.log(`[${n} Error]`,t)}},g=function(){vendetta.logger.log(`Loading ${n}...`);for(let t of["MESSAGE_CREATE","MESSAGE_UPDATE"])vendetta.logger.log(`Dispatching ${t} to enable action handler.`),vendetta.metro.common.FluxDispatcher.dispatch({type:t,message:c("PLACEHOLDER",{id:"0"})});for(let t of["LOAD_MESSAGES","LOAD_MESSAGES_SUCCESS"])vendetta.logger.log(`Dispatching ${t} to enable action handler.`),vendetta.metro.common.FluxDispatcher.dispatch({type:t,messages:[]});i()};g();var m={onLoad:g,onUnload:function(){vendetta.logger.log(`Unloading ${n}...`);for(let t of r)t();vendetta.logger.log(`${n} unloaded.`)}};return a.default=m,Object.defineProperty(a,"__esModule",{value:!0}),a})({});
