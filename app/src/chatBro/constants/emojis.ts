import { delimList } from '../../utils';

/* NOTE:
 *  Extracted from emoji_df.csv found on
 *  https://data.world/eliasdabbas/full-emoji-database#
 *  includes up until Emojio v13.0
 */
const emojiList = [
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '🤣',
  '😂',
  '🙂',
  '🙃',
  '😉',
  '😊',
  '😇',
  '🥰',
  '😍',
  '🤩',
  '😘',
  '😗',
  '☺️',
  '☺',
  '😚',
  '😙',
  '🥲',
  '😋',
  '😛',
  '😜',
  '🤪',
  '😝',
  '🤑',
  '🤗',
  '🤭',
  '🤫',
  '🤔',
  '🤐',
  '🤨',
  '😐',
  '😑',
  '😶',
  '😏',
  '😒',
  '🙄',
  '😬',
  '🤥',
  '😌',
  '😔',
  '😪',
  '🤤',
  '😴',
  '😷',
  '🤒',
  '🤕',
  '🤢',
  '🤮',
  '🤧',
  '🥵',
  '🥶',
  '🥴',
  '😵',
  '🤯',
  '🤠',
  '🥳',
  '🥸',
  '😎',
  '🤓',
  '🧐',
  '😕',
  '😟',
  '🙁',
  '☹️',
  '☹',
  '😮',
  '😯',
  '😲',
  '😳',
  '🥺',
  '😦',
  '😧',
  '😨',
  '😰',
  '😥',
  '😢',
  '😭',
  '😱',
  '😖',
  '😣',
  '😞',
  '😓',
  '😩',
  '😫',
  '🥱',
  '😤',
  '😡',
  '😠',
  '🤬',
  '😈',
  '👿',
  '💀',
  '☠️',
  '☠',
  '💩',
  '🤡',
  '👹',
  '👺',
  '👻',
  '👽',
  '👾',
  '🤖',
  '😺',
  '😸',
  '😹',
  '😻',
  '😼',
  '😽',
  '🙀',
  '😿',
  '😾',
  '🙈',
  '🙉',
  '🙊',
  '💋',
  '💌',
  '💘',
  '💝',
  '💖',
  '💗',
  '💓',
  '💞',
  '💕',
  '💟',
  '❣️',
  '❣',
  '💔',
  '❤️',
  '❤',
  '🧡',
  '💛',
  '💚',
  '💙',
  '💜',
  '🤎',
  '🖤',
  '🤍',
  '💯',
  '💢',
  '💥',
  '💫',
  '💦',
  '💨',
  '🕳️',
  '🕳',
  '💣',
  '💬',
  '👁️‍🗨️',
  '👁‍🗨️',
  '👁️‍🗨',
  '👁‍🗨',
  '🗨️',
  '🗨',
  '🗯️',
  '🗯',
  '💭',
  '💤',
  '👋',
  '👋🏻',
  '👋🏼',
  '👋🏽',
  '👋🏾',
  '👋🏿',
  '🤚',
  '🤚🏻',
  '🤚🏼',
  '🤚🏽',
  '🤚🏾',
  '🤚🏿',
  '🖐️',
  '🖐',
  '🖐🏻',
  '🖐🏼',
  '🖐🏽',
  '🖐🏾',
  '🖐🏿',
  '✋',
  '✋🏻',
  '✋🏼',
  '✋🏽',
  '✋🏾',
  '✋🏿',
  '🖖',
  '🖖🏻',
  '🖖🏼',
  '🖖🏽',
  '🖖🏾',
  '🖖🏿',
  '👌',
  '👌🏻',
  '👌🏼',
  '👌🏽',
  '👌🏾',
  '👌🏿',
  '🤌',
  '🤌🏻',
  '🤌🏼',
  '🤌🏽',
  '🤌🏾',
  '🤌🏿',
  '🤏',
  '🤏🏻',
  '🤏🏼',
  '🤏🏽',
  '🤏🏾',
  '🤏🏿',
  '✌️',
  '✌',
  '✌🏻',
  '✌🏼',
  '✌🏽',
  '✌🏾',
  '✌🏿',
  '🤞',
  '🤞🏻',
  '🤞🏼',
  '🤞🏽',
  '🤞🏾',
  '🤞🏿',
  '🤟',
  '🤟🏻',
  '🤟🏼',
  '🤟🏽',
  '🤟🏾',
  '🤟🏿',
  '🤘',
  '🤘🏻',
  '🤘🏼',
  '🤘🏽',
  '🤘🏾',
  '🤘🏿',
  '🤙',
  '🤙🏻',
  '🤙🏼',
  '🤙🏽',
  '🤙🏾',
  '🤙🏿',
  '👈',
  '👈🏻',
  '👈🏼',
  '👈🏽',
  '👈🏾',
  '👈🏿',
  '👉',
  '👉🏻',
  '👉🏼',
  '👉🏽',
  '👉🏾',
  '👉🏿',
  '👆',
  '👆🏻',
  '👆🏼',
  '👆🏽',
  '👆🏾',
  '👆🏿',
  '🖕',
  '🖕🏻',
  '🖕🏼',
  '🖕🏽',
  '🖕🏾',
  '🖕🏿',
  '👇',
  '👇🏻',
  '👇🏼',
  '👇🏽',
  '👇🏾',
  '👇🏿',
  '☝️',
  '☝',
  '☝🏻',
  '☝🏼',
  '☝🏽',
  '☝🏾',
  '☝🏿',
  '👍',
  '👍🏻',
  '👍🏼',
  '👍🏽',
  '👍🏾',
  '👍🏿',
  '👎',
  '👎🏻',
  '👎🏼',
  '👎🏽',
  '👎🏾',
  '👎🏿',
  '✊',
  '✊🏻',
  '✊🏼',
  '✊🏽',
  '✊🏾',
  '✊🏿',
  '👊',
  '👊🏻',
  '👊🏼',
  '👊🏽',
  '👊🏾',
  '👊🏿',
  '🤛',
  '🤛🏻',
  '🤛🏼',
  '🤛🏽',
  '🤛🏾',
  '🤛🏿',
  '🤜',
  '🤜🏻',
  '🤜🏼',
  '🤜🏽',
  '🤜🏾',
  '🤜🏿',
  '👏',
  '👏🏻',
  '👏🏼',
  '👏🏽',
  '👏🏾',
  '👏🏿',
  '🙌',
  '🙌🏻',
  '🙌🏼',
  '🙌🏽',
  '🙌🏾',
  '🙌🏿',
  '👐',
  '👐🏻',
  '👐🏼',
  '👐🏽',
  '👐🏾',
  '👐🏿',
  '🤲',
  '🤲🏻',
  '🤲🏼',
  '🤲🏽',
  '🤲🏾',
  '🤲🏿',
  '🤝',
  '🙏',
  '🙏🏻',
  '🙏🏼',
  '🙏🏽',
  '🙏🏾',
  '🙏🏿',
  '✍️',
  '✍',
  '✍🏻',
  '✍🏼',
  '✍🏽',
  '✍🏾',
  '✍🏿',
  '💅',
  '💅🏻',
  '💅🏼',
  '💅🏽',
  '💅🏾',
  '💅🏿',
  '🤳',
  '🤳🏻',
  '🤳🏼',
  '🤳🏽',
  '🤳🏾',
  '🤳🏿',
  '💪',
  '💪🏻',
  '💪🏼',
  '💪🏽',
  '💪🏾',
  '💪🏿',
  '🦾',
  '🦿',
  '🦵',
  '🦵🏻',
  '🦵🏼',
  '🦵🏽',
  '🦵🏾',
  '🦵🏿',
  '🦶',
  '🦶🏻',
  '🦶🏼',
  '🦶🏽',
  '🦶🏾',
  '🦶🏿',
  '👂',
  '👂🏻',
  '👂🏼',
  '👂🏽',
  '👂🏾',
  '👂🏿',
  '🦻',
  '🦻🏻',
  '🦻🏼',
  '🦻🏽',
  '🦻🏾',
  '🦻🏿',
  '👃',
  '👃🏻',
  '👃🏼',
  '👃🏽',
  '👃🏾',
  '👃🏿',
  '🧠',
  '🫀',
  '🫁',
  '🦷',
  '🦴',
  '👀',
  '👁️',
  '👁',
  '👅',
  '👄',
  '👶',
  '👶🏻',
  '👶🏼',
  '👶🏽',
  '👶🏾',
  '👶🏿',
  '🧒',
  '🧒🏻',
  '🧒🏼',
  '🧒🏽',
  '🧒🏾',
  '🧒🏿',
  '👦',
  '👦🏻',
  '👦🏼',
  '👦🏽',
  '👦🏾',
  '👦🏿',
  '👧',
  '👧🏻',
  '👧🏼',
  '👧🏽',
  '👧🏾',
  '👧🏿',
  '🧑',
  '🧑🏻',
  '🧑🏼',
  '🧑🏽',
  '🧑🏾',
  '🧑🏿',
  '👱',
  '👱🏻',
  '👱🏼',
  '👱🏽',
  '👱🏾',
  '👱🏿',
  '👨',
  '👨🏻',
  '👨🏼',
  '👨🏽',
  '👨🏾',
  '👨🏿',
  '🧔',
  '🧔🏻',
  '🧔🏼',
  '🧔🏽',
  '🧔🏾',
  '🧔🏿',
  '👨‍🦰',
  '👨🏻‍🦰',
  '👨🏼‍🦰',
  '👨🏽‍🦰',
  '👨🏾‍🦰',
  '👨🏿‍🦰',
  '👨‍🦱',
  '👨🏻‍🦱',
  '👨🏼‍🦱',
  '👨🏽‍🦱',
  '👨🏾‍🦱',
  '👨🏿‍🦱',
  '👨‍🦳',
  '👨🏻‍🦳',
  '👨🏼‍🦳',
  '👨🏽‍🦳',
  '👨🏾‍🦳',
  '👨🏿‍🦳',
  '👨‍🦲',
  '👨🏻‍🦲',
  '👨🏼‍🦲',
  '👨🏽‍🦲',
  '👨🏾‍🦲',
  '👨🏿‍🦲',
  '👩',
  '👩🏻',
  '👩🏼',
  '👩🏽',
  '👩🏾',
  '👩🏿',
  '👩‍🦰',
  '👩🏻‍🦰',
  '👩🏼‍🦰',
  '👩🏽‍🦰',
  '👩🏾‍🦰',
  '👩🏿‍🦰',
  '🧑‍🦰',
  '🧑🏻‍🦰',
  '🧑🏼‍🦰',
  '🧑🏽‍🦰',
  '🧑🏾‍🦰',
  '🧑🏿‍🦰',
  '👩‍🦱',
  '👩🏻‍🦱',
  '👩🏼‍🦱',
  '👩🏽‍🦱',
  '👩🏾‍🦱',
  '👩🏿‍🦱',
  '🧑‍🦱',
  '🧑🏻‍🦱',
  '🧑🏼‍🦱',
  '🧑🏽‍🦱',
  '🧑🏾‍🦱',
  '🧑🏿‍🦱',
  '👩‍🦳',
  '👩🏻‍🦳',
  '👩🏼‍🦳',
  '👩🏽‍🦳',
  '👩🏾‍🦳',
  '👩🏿‍🦳',
  '🧑‍🦳',
  '🧑🏻‍🦳',
  '🧑🏼‍🦳',
  '🧑🏽‍🦳',
  '🧑🏾‍🦳',
  '🧑🏿‍🦳',
  '👩‍🦲',
  '👩🏻‍🦲',
  '👩🏼‍🦲',
  '👩🏽‍🦲',
  '👩🏾‍🦲',
  '👩🏿‍🦲',
  '🧑‍🦲',
  '🧑🏻‍🦲',
  '🧑🏼‍🦲',
  '🧑🏽‍🦲',
  '🧑🏾‍🦲',
  '🧑🏿‍🦲',
  '👱‍♀️',
  '👱‍♀',
  '👱🏻‍♀️',
  '👱🏻‍♀',
  '👱🏼‍♀️',
  '👱🏼‍♀',
  '👱🏽‍♀️',
  '👱🏽‍♀',
  '👱🏾‍♀️',
  '👱🏾‍♀',
  '👱🏿‍♀️',
  '👱🏿‍♀',
  '👱‍♂️',
  '👱‍♂',
  '👱🏻‍♂️',
  '👱🏻‍♂',
  '👱🏼‍♂️',
  '👱🏼‍♂',
  '👱🏽‍♂️',
  '👱🏽‍♂',
  '👱🏾‍♂️',
  '👱🏾‍♂',
  '👱🏿‍♂️',
  '👱🏿‍♂',
  '🧓',
  '🧓🏻',
  '🧓🏼',
  '🧓🏽',
  '🧓🏾',
  '🧓🏿',
  '👴',
  '👴🏻',
  '👴🏼',
  '👴🏽',
  '👴🏾',
  '👴🏿',
  '👵',
  '👵🏻',
  '👵🏼',
  '👵🏽',
  '👵🏾',
  '👵🏿',
  '🙍',
  '🙍🏻',
  '🙍🏼',
  '🙍🏽',
  '🙍🏾',
  '🙍🏿',
  '🙍‍♂️',
  '🙍‍♂',
  '🙍🏻‍♂️',
  '🙍🏻‍♂',
  '🙍🏼‍♂️',
  '🙍🏼‍♂',
  '🙍🏽‍♂️',
  '🙍🏽‍♂',
  '🙍🏾‍♂️',
  '🙍🏾‍♂',
  '🙍🏿‍♂️',
  '🙍🏿‍♂',
  '🙍‍♀️',
  '🙍‍♀',
  '🙍🏻‍♀️',
  '🙍🏻‍♀',
  '🙍🏼‍♀️',
  '🙍🏼‍♀',
  '🙍🏽‍♀️',
  '🙍🏽‍♀',
  '🙍🏾‍♀️',
  '🙍🏾‍♀',
  '🙍🏿‍♀️',
  '🙍🏿‍♀',
  '🙎',
  '🙎🏻',
  '🙎🏼',
  '🙎🏽',
  '🙎🏾',
  '🙎🏿',
  '🙎‍♂️',
  '🙎‍♂',
  '🙎🏻‍♂️',
  '🙎🏻‍♂',
  '🙎🏼‍♂️',
  '🙎🏼‍♂',
  '🙎🏽‍♂️',
  '🙎🏽‍♂',
  '🙎🏾‍♂️',
  '🙎🏾‍♂',
  '🙎🏿‍♂️',
  '🙎🏿‍♂',
  '🙎‍♀️',
  '🙎‍♀',
  '🙎🏻‍♀️',
  '🙎🏻‍♀',
  '🙎🏼‍♀️',
  '🙎🏼‍♀',
  '🙎🏽‍♀️',
  '🙎🏽‍♀',
  '🙎🏾‍♀️',
  '🙎🏾‍♀',
  '🙎🏿‍♀️',
  '🙎🏿‍♀',
  '🙅',
  '🙅🏻',
  '🙅🏼',
  '🙅🏽',
  '🙅🏾',
  '🙅🏿',
  '🙅‍♂️',
  '🙅‍♂',
  '🙅🏻‍♂️',
  '🙅🏻‍♂',
  '🙅🏼‍♂️',
  '🙅🏼‍♂',
  '🙅🏽‍♂️',
  '🙅🏽‍♂',
  '🙅🏾‍♂️',
  '🙅🏾‍♂',
  '🙅🏿‍♂️',
  '🙅🏿‍♂',
  '🙅‍♀️',
  '🙅‍♀',
  '🙅🏻‍♀️',
  '🙅🏻‍♀',
  '🙅🏼‍♀️',
  '🙅🏼‍♀',
  '🙅🏽‍♀️',
  '🙅🏽‍♀',
  '🙅🏾‍♀️',
  '🙅🏾‍♀',
  '🙅🏿‍♀️',
  '🙅🏿‍♀',
  '🙆',
  '🙆🏻',
  '🙆🏼',
  '🙆🏽',
  '🙆🏾',
  '🙆🏿',
  '🙆‍♂️',
  '🙆‍♂',
  '🙆🏻‍♂️',
  '🙆🏻‍♂',
  '🙆🏼‍♂️',
  '🙆🏼‍♂',
  '🙆🏽‍♂️',
  '🙆🏽‍♂',
  '🙆🏾‍♂️',
  '🙆🏾‍♂',
  '🙆🏿‍♂️',
  '🙆🏿‍♂',
  '🙆‍♀️',
  '🙆‍♀',
  '🙆🏻‍♀️',
  '🙆🏻‍♀',
  '🙆🏼‍♀️',
  '🙆🏼‍♀',
  '🙆🏽‍♀️',
  '🙆🏽‍♀',
  '🙆🏾‍♀️',
  '🙆🏾‍♀',
  '🙆🏿‍♀️',
  '🙆🏿‍♀',
  '💁',
  '💁🏻',
  '💁🏼',
  '💁🏽',
  '💁🏾',
  '💁🏿',
  '💁‍♂️',
  '💁‍♂',
  '💁🏻‍♂️',
  '💁🏻‍♂',
  '💁🏼‍♂️',
  '💁🏼‍♂',
  '💁🏽‍♂️',
  '💁🏽‍♂',
  '💁🏾‍♂️',
  '💁🏾‍♂',
  '💁🏿‍♂️',
  '💁🏿‍♂',
  '💁‍♀️',
  '💁‍♀',
  '💁🏻‍♀️',
  '💁🏻‍♀',
  '💁🏼‍♀️',
  '💁🏼‍♀',
  '💁🏽‍♀️',
  '💁🏽‍♀',
  '💁🏾‍♀️',
  '💁🏾‍♀',
  '💁🏿‍♀️',
  '💁🏿‍♀',
  '🙋',
  '🙋🏻',
  '🙋🏼',
  '🙋🏽',
  '🙋🏾',
  '🙋🏿',
  '🙋‍♂️',
  '🙋‍♂',
  '🙋🏻‍♂️',
  '🙋🏻‍♂',
  '🙋🏼‍♂️',
  '🙋🏼‍♂',
  '🙋🏽‍♂️',
  '🙋🏽‍♂',
  '🙋🏾‍♂️',
  '🙋🏾‍♂',
  '🙋🏿‍♂️',
  '🙋🏿‍♂',
  '🙋‍♀️',
  '🙋‍♀',
  '🙋🏻‍♀️',
  '🙋🏻‍♀',
  '🙋🏼‍♀️',
  '🙋🏼‍♀',
  '🙋🏽‍♀️',
  '🙋🏽‍♀',
  '🙋🏾‍♀️',
  '🙋🏾‍♀',
  '🙋🏿‍♀️',
  '🙋🏿‍♀',
  '🧏',
  '🧏🏻',
  '🧏🏼',
  '🧏🏽',
  '🧏🏾',
  '🧏🏿',
  '🧏‍♂️',
  '🧏‍♂',
  '🧏🏻‍♂️',
  '🧏🏻‍♂',
  '🧏🏼‍♂️',
  '🧏🏼‍♂',
  '🧏🏽‍♂️',
  '🧏🏽‍♂',
  '🧏🏾‍♂️',
  '🧏🏾‍♂',
  '🧏🏿‍♂️',
  '🧏🏿‍♂',
  '🧏‍♀️',
  '🧏‍♀',
  '🧏🏻‍♀️',
  '🧏🏻‍♀',
  '🧏🏼‍♀️',
  '🧏🏼‍♀',
  '🧏🏽‍♀️',
  '🧏🏽‍♀',
  '🧏🏾‍♀️',
  '🧏🏾‍♀',
  '🧏🏿‍♀️',
  '🧏🏿‍♀',
  '🙇',
  '🙇🏻',
  '🙇🏼',
  '🙇🏽',
  '🙇🏾',
  '🙇🏿',
  '🙇‍♂️',
  '🙇‍♂',
  '🙇🏻‍♂️',
  '🙇🏻‍♂',
  '🙇🏼‍♂️',
  '🙇🏼‍♂',
  '🙇🏽‍♂️',
  '🙇🏽‍♂',
  '🙇🏾‍♂️',
  '🙇🏾‍♂',
  '🙇🏿‍♂️',
  '🙇🏿‍♂',
  '🙇‍♀️',
  '🙇‍♀',
  '🙇🏻‍♀️',
  '🙇🏻‍♀',
  '🙇🏼‍♀️',
  '🙇🏼‍♀',
  '🙇🏽‍♀️',
  '🙇🏽‍♀',
  '🙇🏾‍♀️',
  '🙇🏾‍♀',
  '🙇🏿‍♀️',
  '🙇🏿‍♀',
  '🤦',
  '🤦🏻',
  '🤦🏼',
  '🤦🏽',
  '🤦🏾',
  '🤦🏿',
  '🤦‍♂️',
  '🤦‍♂',
  '🤦🏻‍♂️',
  '🤦🏻‍♂',
  '🤦🏼‍♂️',
  '🤦🏼‍♂',
  '🤦🏽‍♂️',
  '🤦🏽‍♂',
  '🤦🏾‍♂️',
  '🤦🏾‍♂',
  '🤦🏿‍♂️',
  '🤦🏿‍♂',
  '🤦‍♀️',
  '🤦‍♀',
  '🤦🏻‍♀️',
  '🤦🏻‍♀',
  '🤦🏼‍♀️',
  '🤦🏼‍♀',
  '🤦🏽‍♀️',
  '🤦🏽‍♀',
  '🤦🏾‍♀️',
  '🤦🏾‍♀',
  '🤦🏿‍♀️',
  '🤦🏿‍♀',
  '🤷',
  '🤷🏻',
  '🤷🏼',
  '🤷🏽',
  '🤷🏾',
  '🤷🏿',
  '🤷‍♂️',
  '🤷‍♂',
  '🤷🏻‍♂️',
  '🤷🏻‍♂',
  '🤷🏼‍♂️',
  '🤷🏼‍♂',
  '🤷🏽‍♂️',
  '🤷🏽‍♂',
  '🤷🏾‍♂️',
  '🤷🏾‍♂',
  '🤷🏿‍♂️',
  '🤷🏿‍♂',
  '🤷‍♀️',
  '🤷‍♀',
  '🤷🏻‍♀️',
  '🤷🏻‍♀',
  '🤷🏼‍♀️',
  '🤷🏼‍♀',
  '🤷🏽‍♀️',
  '🤷🏽‍♀',
  '🤷🏾‍♀️',
  '🤷🏾‍♀',
  '🤷🏿‍♀️',
  '🤷🏿‍♀',
  '🧑‍⚕️',
  '🧑‍⚕',
  '🧑🏻‍⚕️',
  '🧑🏻‍⚕',
  '🧑🏼‍⚕️',
  '🧑🏼‍⚕',
  '🧑🏽‍⚕️',
  '🧑🏽‍⚕',
  '🧑🏾‍⚕️',
  '🧑🏾‍⚕',
  '🧑🏿‍⚕️',
  '🧑🏿‍⚕',
  '👨‍⚕️',
  '👨‍⚕',
  '👨🏻‍⚕️',
  '👨🏻‍⚕',
  '👨🏼‍⚕️',
  '👨🏼‍⚕',
  '👨🏽‍⚕️',
  '👨🏽‍⚕',
  '👨🏾‍⚕️',
  '👨🏾‍⚕',
  '👨🏿‍⚕️',
  '👨🏿‍⚕',
  '👩‍⚕️',
  '👩‍⚕',
  '👩🏻‍⚕️',
  '👩🏻‍⚕',
  '👩🏼‍⚕️',
  '👩🏼‍⚕',
  '👩🏽‍⚕️',
  '👩🏽‍⚕',
  '👩🏾‍⚕️',
  '👩🏾‍⚕',
  '👩🏿‍⚕️',
  '👩🏿‍⚕',
  '🧑‍🎓',
  '🧑🏻‍🎓',
  '🧑🏼‍🎓',
  '🧑🏽‍🎓',
  '🧑🏾‍🎓',
  '🧑🏿‍🎓',
  '👨‍🎓',
  '👨🏻‍🎓',
  '👨🏼‍🎓',
  '👨🏽‍🎓',
  '👨🏾‍🎓',
  '👨🏿‍🎓',
  '👩‍🎓',
  '👩🏻‍🎓',
  '👩🏼‍🎓',
  '👩🏽‍🎓',
  '👩🏾‍🎓',
  '👩🏿‍🎓',
  '🧑‍🏫',
  '🧑🏻‍🏫',
  '🧑🏼‍🏫',
  '🧑🏽‍🏫',
  '🧑🏾‍🏫',
  '🧑🏿‍🏫',
  '👨‍🏫',
  '👨🏻‍🏫',
  '👨🏼‍🏫',
  '👨🏽‍🏫',
  '👨🏾‍🏫',
  '👨🏿‍🏫',
  '👩‍🏫',
  '👩🏻‍🏫',
  '👩🏼‍🏫',
  '👩🏽‍🏫',
  '👩🏾‍🏫',
  '👩🏿‍🏫',
  '🧑‍⚖️',
  '🧑‍⚖',
  '🧑🏻‍⚖️',
  '🧑🏻‍⚖',
  '🧑🏼‍⚖️',
  '🧑🏼‍⚖',
  '🧑🏽‍⚖️',
  '🧑🏽‍⚖',
  '🧑🏾‍⚖️',
  '🧑🏾‍⚖',
  '🧑🏿‍⚖️',
  '🧑🏿‍⚖',
  '👨‍⚖️',
  '👨‍⚖',
  '👨🏻‍⚖️',
  '👨🏻‍⚖',
  '👨🏼‍⚖️',
  '👨🏼‍⚖',
  '👨🏽‍⚖️',
  '👨🏽‍⚖',
  '👨🏾‍⚖️',
  '👨🏾‍⚖',
  '👨🏿‍⚖️',
  '👨🏿‍⚖',
  '👩‍⚖️',
  '👩‍⚖',
  '👩🏻‍⚖️',
  '👩🏻‍⚖',
  '👩🏼‍⚖️',
  '👩🏼‍⚖',
  '👩🏽‍⚖️',
  '👩🏽‍⚖',
  '👩🏾‍⚖️',
  '👩🏾‍⚖',
  '👩🏿‍⚖️',
  '👩🏿‍⚖',
  '🧑‍🌾',
  '🧑🏻‍🌾',
  '🧑🏼‍🌾',
  '🧑🏽‍🌾',
  '🧑🏾‍🌾',
  '🧑🏿‍🌾',
  '👨‍🌾',
  '👨🏻‍🌾',
  '👨🏼‍🌾',
  '👨🏽‍🌾',
  '👨🏾‍🌾',
  '👨🏿‍🌾',
  '👩‍🌾',
  '👩🏻‍🌾',
  '👩🏼‍🌾',
  '👩🏽‍🌾',
  '👩🏾‍🌾',
  '👩🏿‍🌾',
  '🧑‍🍳',
  '🧑🏻‍🍳',
  '🧑🏼‍🍳',
  '🧑🏽‍🍳',
  '🧑🏾‍🍳',
  '🧑🏿‍🍳',
  '👨‍🍳',
  '👨🏻‍🍳',
  '👨🏼‍🍳',
  '👨🏽‍🍳',
  '👨🏾‍🍳',
  '👨🏿‍🍳',
  '👩‍🍳',
  '👩🏻‍🍳',
  '👩🏼‍🍳',
  '👩🏽‍🍳',
  '👩🏾‍🍳',
  '👩🏿‍🍳',
  '🧑‍🔧',
  '🧑🏻‍🔧',
  '🧑🏼‍🔧',
  '🧑🏽‍🔧',
  '🧑🏾‍🔧',
  '🧑🏿‍🔧',
  '👨‍🔧',
  '👨🏻‍🔧',
  '👨🏼‍🔧',
  '👨🏽‍🔧',
  '👨🏾‍🔧',
  '👨🏿‍🔧',
  '👩‍🔧',
  '👩🏻‍🔧',
  '👩🏼‍🔧',
  '👩🏽‍🔧',
  '👩🏾‍🔧',
  '👩🏿‍🔧',
  '🧑‍🏭',
  '🧑🏻‍🏭',
  '🧑🏼‍🏭',
  '🧑🏽‍🏭',
  '🧑🏾‍🏭',
  '🧑🏿‍🏭',
  '👨‍🏭',
  '👨🏻‍🏭',
  '👨🏼‍🏭',
  '👨🏽‍🏭',
  '👨🏾‍🏭',
  '👨🏿‍🏭',
  '👩‍🏭',
  '👩🏻‍🏭',
  '👩🏼‍🏭',
  '👩🏽‍🏭',
  '👩🏾‍🏭',
  '👩🏿‍🏭',
  '🧑‍💼',
  '🧑🏻‍💼',
  '🧑🏼‍💼',
  '🧑🏽‍💼',
  '🧑🏾‍💼',
  '🧑🏿‍💼',
  '👨‍💼',
  '👨🏻‍💼',
  '👨🏼‍💼',
  '👨🏽‍💼',
  '👨🏾‍💼',
  '👨🏿‍💼',
  '👩‍💼',
  '👩🏻‍💼',
  '👩🏼‍💼',
  '👩🏽‍💼',
  '👩🏾‍💼',
  '👩🏿‍💼',
  '🧑‍🔬',
  '🧑🏻‍🔬',
  '🧑🏼‍🔬',
  '🧑🏽‍🔬',
  '🧑🏾‍🔬',
  '🧑🏿‍🔬',
  '👨‍🔬',
  '👨🏻‍🔬',
  '👨🏼‍🔬',
  '👨🏽‍🔬',
  '👨🏾‍🔬',
  '👨🏿‍🔬',
  '👩‍🔬',
  '👩🏻‍🔬',
  '👩🏼‍🔬',
  '👩🏽‍🔬',
  '👩🏾‍🔬',
  '👩🏿‍🔬',
  '🧑‍💻',
  '🧑🏻‍💻',
  '🧑🏼‍💻',
  '🧑🏽‍💻',
  '🧑🏾‍💻',
  '🧑🏿‍💻',
  '👨‍💻',
  '👨🏻‍💻',
  '👨🏼‍💻',
  '👨🏽‍💻',
  '👨🏾‍💻',
  '👨🏿‍💻',
  '👩‍💻',
  '👩🏻‍💻',
  '👩🏼‍💻',
  '👩🏽‍💻',
  '👩🏾‍💻',
  '👩🏿‍💻',
  '🧑‍🎤',
  '🧑🏻‍🎤',
  '🧑🏼‍🎤',
  '🧑🏽‍🎤',
  '🧑🏾‍🎤',
  '🧑🏿‍🎤',
  '👨‍🎤',
  '👨🏻‍🎤',
  '👨🏼‍🎤',
  '👨🏽‍🎤',
  '👨🏾‍🎤',
  '👨🏿‍🎤',
  '👩‍🎤',
  '👩🏻‍🎤',
  '👩🏼‍🎤',
  '👩🏽‍🎤',
  '👩🏾‍🎤',
  '👩🏿‍🎤',
  '🧑‍🎨',
  '🧑🏻‍🎨',
  '🧑🏼‍🎨',
  '🧑🏽‍🎨',
  '🧑🏾‍🎨',
  '🧑🏿‍🎨',
  '👨‍🎨',
  '👨🏻‍🎨',
  '👨🏼‍🎨',
  '👨🏽‍🎨',
  '👨🏾‍🎨',
  '👨🏿‍🎨',
  '👩‍🎨',
  '👩🏻‍🎨',
  '👩🏼‍🎨',
  '👩🏽‍🎨',
  '👩🏾‍🎨',
  '👩🏿‍🎨',
  '🧑‍✈️',
  '🧑‍✈',
  '🧑🏻‍✈️',
  '🧑🏻‍✈',
  '🧑🏼‍✈️',
  '🧑🏼‍✈',
  '🧑🏽‍✈️',
  '🧑🏽‍✈',
  '🧑🏾‍✈️',
  '🧑🏾‍✈',
  '🧑🏿‍✈️',
  '🧑🏿‍✈',
  '👨‍✈️',
  '👨‍✈',
  '👨🏻‍✈️',
  '👨🏻‍✈',
  '👨🏼‍✈️',
  '👨🏼‍✈',
  '👨🏽‍✈️',
  '👨🏽‍✈',
  '👨🏾‍✈️',
  '👨🏾‍✈',
  '👨🏿‍✈️',
  '👨🏿‍✈',
  '👩‍✈️',
  '👩‍✈',
  '👩🏻‍✈️',
  '👩🏻‍✈',
  '👩🏼‍✈️',
  '👩🏼‍✈',
  '👩🏽‍✈️',
  '👩🏽‍✈',
  '👩🏾‍✈️',
  '👩🏾‍✈',
  '👩🏿‍✈️',
  '👩🏿‍✈',
  '🧑‍🚀',
  '🧑🏻‍🚀',
  '🧑🏼‍🚀',
  '🧑🏽‍🚀',
  '🧑🏾‍🚀',
  '🧑🏿‍🚀',
  '👨‍🚀',
  '👨🏻‍🚀',
  '👨🏼‍🚀',
  '👨🏽‍🚀',
  '👨🏾‍🚀',
  '👨🏿‍🚀',
  '👩‍🚀',
  '👩🏻‍🚀',
  '👩🏼‍🚀',
  '👩🏽‍🚀',
  '👩🏾‍🚀',
  '👩🏿‍🚀',
  '🧑‍🚒',
  '🧑🏻‍🚒',
  '🧑🏼‍🚒',
  '🧑🏽‍🚒',
  '🧑🏾‍🚒',
  '🧑🏿‍🚒',
  '👨‍🚒',
  '👨🏻‍🚒',
  '👨🏼‍🚒',
  '👨🏽‍🚒',
  '👨🏾‍🚒',
  '👨🏿‍🚒',
  '👩‍🚒',
  '👩🏻‍🚒',
  '👩🏼‍🚒',
  '👩🏽‍🚒',
  '👩🏾‍🚒',
  '👩🏿‍🚒',
  '👮',
  '👮🏻',
  '👮🏼',
  '👮🏽',
  '👮🏾',
  '👮🏿',
  '👮‍♂️',
  '👮‍♂',
  '👮🏻‍♂️',
  '👮🏻‍♂',
  '👮🏼‍♂️',
  '👮🏼‍♂',
  '👮🏽‍♂️',
  '👮🏽‍♂',
  '👮🏾‍♂️',
  '👮🏾‍♂',
  '👮🏿‍♂️',
  '👮🏿‍♂',
  '👮‍♀️',
  '👮‍♀',
  '👮🏻‍♀️',
  '👮🏻‍♀',
  '👮🏼‍♀️',
  '👮🏼‍♀',
  '👮🏽‍♀️',
  '👮🏽‍♀',
  '👮🏾‍♀️',
  '👮🏾‍♀',
  '👮🏿‍♀️',
  '👮🏿‍♀',
  '🕵️',
  '🕵',
  '🕵🏻',
  '🕵🏼',
  '🕵🏽',
  '🕵🏾',
  '🕵🏿',
  '🕵️‍♂️',
  '🕵‍♂️',
  '🕵️‍♂',
  '🕵‍♂',
  '🕵🏻‍♂️',
  '🕵🏻‍♂',
  '🕵🏼‍♂️',
  '🕵🏼‍♂',
  '🕵🏽‍♂️',
  '🕵🏽‍♂',
  '🕵🏾‍♂️',
  '🕵🏾‍♂',
  '🕵🏿‍♂️',
  '🕵🏿‍♂',
  '🕵️‍♀️',
  '🕵‍♀️',
  '🕵️‍♀',
  '🕵‍♀',
  '🕵🏻‍♀️',
  '🕵🏻‍♀',
  '🕵🏼‍♀️',
  '🕵🏼‍♀',
  '🕵🏽‍♀️',
  '🕵🏽‍♀',
  '🕵🏾‍♀️',
  '🕵🏾‍♀',
  '🕵🏿‍♀️',
  '🕵🏿‍♀',
  '💂',
  '💂🏻',
  '💂🏼',
  '💂🏽',
  '💂🏾',
  '💂🏿',
  '💂‍♂️',
  '💂‍♂',
  '💂🏻‍♂️',
  '💂🏻‍♂',
  '💂🏼‍♂️',
  '💂🏼‍♂',
  '💂🏽‍♂️',
  '💂🏽‍♂',
  '💂🏾‍♂️',
  '💂🏾‍♂',
  '💂🏿‍♂️',
  '💂🏿‍♂',
  '💂‍♀️',
  '💂‍♀',
  '💂🏻‍♀️',
  '💂🏻‍♀',
  '💂🏼‍♀️',
  '💂🏼‍♀',
  '💂🏽‍♀️',
  '💂🏽‍♀',
  '💂🏾‍♀️',
  '💂🏾‍♀',
  '💂🏿‍♀️',
  '💂🏿‍♀',
  '🥷',
  '🥷🏻',
  '🥷🏼',
  '🥷🏽',
  '🥷🏾',
  '🥷🏿',
  '👷',
  '👷🏻',
  '👷🏼',
  '👷🏽',
  '👷🏾',
  '👷🏿',
  '👷‍♂️',
  '👷‍♂',
  '👷🏻‍♂️',
  '👷🏻‍♂',
  '👷🏼‍♂️',
  '👷🏼‍♂',
  '👷🏽‍♂️',
  '👷🏽‍♂',
  '👷🏾‍♂️',
  '👷🏾‍♂',
  '👷🏿‍♂️',
  '👷🏿‍♂',
  '👷‍♀️',
  '👷‍♀',
  '👷🏻‍♀️',
  '👷🏻‍♀',
  '👷🏼‍♀️',
  '👷🏼‍♀',
  '👷🏽‍♀️',
  '👷🏽‍♀',
  '👷🏾‍♀️',
  '👷🏾‍♀',
  '👷🏿‍♀️',
  '👷🏿‍♀',
  '🤴',
  '🤴🏻',
  '🤴🏼',
  '🤴🏽',
  '🤴🏾',
  '🤴🏿',
  '👸',
  '👸🏻',
  '👸🏼',
  '👸🏽',
  '👸🏾',
  '👸🏿',
  '👳',
  '👳🏻',
  '👳🏼',
  '👳🏽',
  '👳🏾',
  '👳🏿',
  '👳‍♂️',
  '👳‍♂',
  '👳🏻‍♂️',
  '👳🏻‍♂',
  '👳🏼‍♂️',
  '👳🏼‍♂',
  '👳🏽‍♂️',
  '👳🏽‍♂',
  '👳🏾‍♂️',
  '👳🏾‍♂',
  '👳🏿‍♂️',
  '👳🏿‍♂',
  '👳‍♀️',
  '👳‍♀',
  '👳🏻‍♀️',
  '👳🏻‍♀',
  '👳🏼‍♀️',
  '👳🏼‍♀',
  '👳🏽‍♀️',
  '👳🏽‍♀',
  '👳🏾‍♀️',
  '👳🏾‍♀',
  '👳🏿‍♀️',
  '👳🏿‍♀',
  '👲',
  '👲🏻',
  '👲🏼',
  '👲🏽',
  '👲🏾',
  '👲🏿',
  '🧕',
  '🧕🏻',
  '🧕🏼',
  '🧕🏽',
  '🧕🏾',
  '🧕🏿',
  '🤵',
  '🤵🏻',
  '🤵🏼',
  '🤵🏽',
  '🤵🏾',
  '🤵🏿',
  '🤵‍♂️',
  '🤵‍♂',
  '🤵🏻‍♂️',
  '🤵🏻‍♂',
  '🤵🏼‍♂️',
  '🤵🏼‍♂',
  '🤵🏽‍♂️',
  '🤵🏽‍♂',
  '🤵🏾‍♂️',
  '🤵🏾‍♂',
  '🤵🏿‍♂️',
  '🤵🏿‍♂',
  '🤵‍♀️',
  '🤵‍♀',
  '🤵🏻‍♀️',
  '🤵🏻‍♀',
  '🤵🏼‍♀️',
  '🤵🏼‍♀',
  '🤵🏽‍♀️',
  '🤵🏽‍♀',
  '🤵🏾‍♀️',
  '🤵🏾‍♀',
  '🤵🏿‍♀️',
  '🤵🏿‍♀',
  '👰',
  '👰🏻',
  '👰🏼',
  '👰🏽',
  '👰🏾',
  '👰🏿',
  '👰‍♂️',
  '👰‍♂',
  '👰🏻‍♂️',
  '👰🏻‍♂',
  '👰🏼‍♂️',
  '👰🏼‍♂',
  '👰🏽‍♂️',
  '👰🏽‍♂',
  '👰🏾‍♂️',
  '👰🏾‍♂',
  '👰🏿‍♂️',
  '👰🏿‍♂',
  '👰‍♀️',
  '👰‍♀',
  '👰🏻‍♀️',
  '👰🏻‍♀',
  '👰🏼‍♀️',
  '👰🏼‍♀',
  '👰🏽‍♀️',
  '👰🏽‍♀',
  '👰🏾‍♀️',
  '👰🏾‍♀',
  '👰🏿‍♀️',
  '👰🏿‍♀',
  '🤰',
  '🤰🏻',
  '🤰🏼',
  '🤰🏽',
  '🤰🏾',
  '🤰🏿',
  '🤱',
  '🤱🏻',
  '🤱🏼',
  '🤱🏽',
  '🤱🏾',
  '🤱🏿',
  '👩‍🍼',
  '👩🏻‍🍼',
  '👩🏼‍🍼',
  '👩🏽‍🍼',
  '👩🏾‍🍼',
  '👩🏿‍🍼',
  '👨‍🍼',
  '👨🏻‍🍼',
  '👨🏼‍🍼',
  '👨🏽‍🍼',
  '👨🏾‍🍼',
  '👨🏿‍🍼',
  '🧑‍🍼',
  '🧑🏻‍🍼',
  '🧑🏼‍🍼',
  '🧑🏽‍🍼',
  '🧑🏾‍🍼',
  '🧑🏿‍🍼',
  '👼',
  '👼🏻',
  '👼🏼',
  '👼🏽',
  '👼🏾',
  '👼🏿',
  '🎅',
  '🎅🏻',
  '🎅🏼',
  '🎅🏽',
  '🎅🏾',
  '🎅🏿',
  '🤶',
  '🤶🏻',
  '🤶🏼',
  '🤶🏽',
  '🤶🏾',
  '🤶🏿',
  '🧑‍🎄',
  '🧑🏻‍🎄',
  '🧑🏼‍🎄',
  '🧑🏽‍🎄',
  '🧑🏾‍🎄',
  '🧑🏿‍🎄',
  '🦸',
  '🦸🏻',
  '🦸🏼',
  '🦸🏽',
  '🦸🏾',
  '🦸🏿',
  '🦸‍♂️',
  '🦸‍♂',
  '🦸🏻‍♂️',
  '🦸🏻‍♂',
  '🦸🏼‍♂️',
  '🦸🏼‍♂',
  '🦸🏽‍♂️',
  '🦸🏽‍♂',
  '🦸🏾‍♂️',
  '🦸🏾‍♂',
  '🦸🏿‍♂️',
  '🦸🏿‍♂',
  '🦸‍♀️',
  '🦸‍♀',
  '🦸🏻‍♀️',
  '🦸🏻‍♀',
  '🦸🏼‍♀️',
  '🦸🏼‍♀',
  '🦸🏽‍♀️',
  '🦸🏽‍♀',
  '🦸🏾‍♀️',
  '🦸🏾‍♀',
  '🦸🏿‍♀️',
  '🦸🏿‍♀',
  '🦹',
  '🦹🏻',
  '🦹🏼',
  '🦹🏽',
  '🦹🏾',
  '🦹🏿',
  '🦹‍♂️',
  '🦹‍♂',
  '🦹🏻‍♂️',
  '🦹🏻‍♂',
  '🦹🏼‍♂️',
  '🦹🏼‍♂',
  '🦹🏽‍♂️',
  '🦹🏽‍♂',
  '🦹🏾‍♂️',
  '🦹🏾‍♂',
  '🦹🏿‍♂️',
  '🦹🏿‍♂',
  '🦹‍♀️',
  '🦹‍♀',
  '🦹🏻‍♀️',
  '🦹🏻‍♀',
  '🦹🏼‍♀️',
  '🦹🏼‍♀',
  '🦹🏽‍♀️',
  '🦹🏽‍♀',
  '🦹🏾‍♀️',
  '🦹🏾‍♀',
  '🦹🏿‍♀️',
  '🦹🏿‍♀',
  '🧙',
  '🧙🏻',
  '🧙🏼',
  '🧙🏽',
  '🧙🏾',
  '🧙🏿',
  '🧙‍♂️',
  '🧙‍♂',
  '🧙🏻‍♂️',
  '🧙🏻‍♂',
  '🧙🏼‍♂️',
  '🧙🏼‍♂',
  '🧙🏽‍♂️',
  '🧙🏽‍♂',
  '🧙🏾‍♂️',
  '🧙🏾‍♂',
  '🧙🏿‍♂️',
  '🧙🏿‍♂',
  '🧙‍♀️',
  '🧙‍♀',
  '🧙🏻‍♀️',
  '🧙🏻‍♀',
  '🧙🏼‍♀️',
  '🧙🏼‍♀',
  '🧙🏽‍♀️',
  '🧙🏽‍♀',
  '🧙🏾‍♀️',
  '🧙🏾‍♀',
  '🧙🏿‍♀️',
  '🧙🏿‍♀',
  '🧚',
  '🧚🏻',
  '🧚🏼',
  '🧚🏽',
  '🧚🏾',
  '🧚🏿',
  '🧚‍♂️',
  '🧚‍♂',
  '🧚🏻‍♂️',
  '🧚🏻‍♂',
  '🧚🏼‍♂️',
  '🧚🏼‍♂',
  '🧚🏽‍♂️',
  '🧚🏽‍♂',
  '🧚🏾‍♂️',
  '🧚🏾‍♂',
  '🧚🏿‍♂️',
  '🧚🏿‍♂',
  '🧚‍♀️',
  '🧚‍♀',
  '🧚🏻‍♀️',
  '🧚🏻‍♀',
  '🧚🏼‍♀️',
  '🧚🏼‍♀',
  '🧚🏽‍♀️',
  '🧚🏽‍♀',
  '🧚🏾‍♀️',
  '🧚🏾‍♀',
  '🧚🏿‍♀️',
  '🧚🏿‍♀',
  '🧛',
  '🧛🏻',
  '🧛🏼',
  '🧛🏽',
  '🧛🏾',
  '🧛🏿',
  '🧛‍♂️',
  '🧛‍♂',
  '🧛🏻‍♂️',
  '🧛🏻‍♂',
  '🧛🏼‍♂️',
  '🧛🏼‍♂',
  '🧛🏽‍♂️',
  '🧛🏽‍♂',
  '🧛🏾‍♂️',
  '🧛🏾‍♂',
  '🧛🏿‍♂️',
  '🧛🏿‍♂',
  '🧛‍♀️',
  '🧛‍♀',
  '🧛🏻‍♀️',
  '🧛🏻‍♀',
  '🧛🏼‍♀️',
  '🧛🏼‍♀',
  '🧛🏽‍♀️',
  '🧛🏽‍♀',
  '🧛🏾‍♀️',
  '🧛🏾‍♀',
  '🧛🏿‍♀️',
  '🧛🏿‍♀',
  '🧜',
  '🧜🏻',
  '🧜🏼',
  '🧜🏽',
  '🧜🏾',
  '🧜🏿',
  '🧜‍♂️',
  '🧜‍♂',
  '🧜🏻‍♂️',
  '🧜🏻‍♂',
  '🧜🏼‍♂️',
  '🧜🏼‍♂',
  '🧜🏽‍♂️',
  '🧜🏽‍♂',
  '🧜🏾‍♂️',
  '🧜🏾‍♂',
  '🧜🏿‍♂️',
  '🧜🏿‍♂',
  '🧜‍♀️',
  '🧜‍♀',
  '🧜🏻‍♀️',
  '🧜🏻‍♀',
  '🧜🏼‍♀️',
  '🧜🏼‍♀',
  '🧜🏽‍♀️',
  '🧜🏽‍♀',
  '🧜🏾‍♀️',
  '🧜🏾‍♀',
  '🧜🏿‍♀️',
  '🧜🏿‍♀',
  '🧝',
  '🧝🏻',
  '🧝🏼',
  '🧝🏽',
  '🧝🏾',
  '🧝🏿',
  '🧝‍♂️',
  '🧝‍♂',
  '🧝🏻‍♂️',
  '🧝🏻‍♂',
  '🧝🏼‍♂️',
  '🧝🏼‍♂',
  '🧝🏽‍♂️',
  '🧝🏽‍♂',
  '🧝🏾‍♂️',
  '🧝🏾‍♂',
  '🧝🏿‍♂️',
  '🧝🏿‍♂',
  '🧝‍♀️',
  '🧝‍♀',
  '🧝🏻‍♀️',
  '🧝🏻‍♀',
  '🧝🏼‍♀️',
  '🧝🏼‍♀',
  '🧝🏽‍♀️',
  '🧝🏽‍♀',
  '🧝🏾‍♀️',
  '🧝🏾‍♀',
  '🧝🏿‍♀️',
  '🧝🏿‍♀',
  '🧞',
  '🧞‍♂️',
  '🧞‍♂',
  '🧞‍♀️',
  '🧞‍♀',
  '🧟',
  '🧟‍♂️',
  '🧟‍♂',
  '🧟‍♀️',
  '🧟‍♀',
  '💆',
  '💆🏻',
  '💆🏼',
  '💆🏽',
  '💆🏾',
  '💆🏿',
  '💆‍♂️',
  '💆‍♂',
  '💆🏻‍♂️',
  '💆🏻‍♂',
  '💆🏼‍♂️',
  '💆🏼‍♂',
  '💆🏽‍♂️',
  '💆🏽‍♂',
  '💆🏾‍♂️',
  '💆🏾‍♂',
  '💆🏿‍♂️',
  '💆🏿‍♂',
  '💆‍♀️',
  '💆‍♀',
  '💆🏻‍♀️',
  '💆🏻‍♀',
  '💆🏼‍♀️',
  '💆🏼‍♀',
  '💆🏽‍♀️',
  '💆🏽‍♀',
  '💆🏾‍♀️',
  '💆🏾‍♀',
  '💆🏿‍♀️',
  '💆🏿‍♀',
  '💇',
  '💇🏻',
  '💇🏼',
  '💇🏽',
  '💇🏾',
  '💇🏿',
  '💇‍♂️',
  '💇‍♂',
  '💇🏻‍♂️',
  '💇🏻‍♂',
  '💇🏼‍♂️',
  '💇🏼‍♂',
  '💇🏽‍♂️',
  '💇🏽‍♂',
  '💇🏾‍♂️',
  '💇🏾‍♂',
  '💇🏿‍♂️',
  '💇🏿‍♂',
  '💇‍♀️',
  '💇‍♀',
  '💇🏻‍♀️',
  '💇🏻‍♀',
  '💇🏼‍♀️',
  '💇🏼‍♀',
  '💇🏽‍♀️',
  '💇🏽‍♀',
  '💇🏾‍♀️',
  '💇🏾‍♀',
  '💇🏿‍♀️',
  '💇🏿‍♀',
  '🚶',
  '🚶🏻',
  '🚶🏼',
  '🚶🏽',
  '🚶🏾',
  '🚶🏿',
  '🚶‍♂️',
  '🚶‍♂',
  '🚶🏻‍♂️',
  '🚶🏻‍♂',
  '🚶🏼‍♂️',
  '🚶🏼‍♂',
  '🚶🏽‍♂️',
  '🚶🏽‍♂',
  '🚶🏾‍♂️',
  '🚶🏾‍♂',
  '🚶🏿‍♂️',
  '🚶🏿‍♂',
  '🚶‍♀️',
  '🚶‍♀',
  '🚶🏻‍♀️',
  '🚶🏻‍♀',
  '🚶🏼‍♀️',
  '🚶🏼‍♀',
  '🚶🏽‍♀️',
  '🚶🏽‍♀',
  '🚶🏾‍♀️',
  '🚶🏾‍♀',
  '🚶🏿‍♀️',
  '🚶🏿‍♀',
  '🧍',
  '🧍🏻',
  '🧍🏼',
  '🧍🏽',
  '🧍🏾',
  '🧍🏿',
  '🧍‍♂️',
  '🧍‍♂',
  '🧍🏻‍♂️',
  '🧍🏻‍♂',
  '🧍🏼‍♂️',
  '🧍🏼‍♂',
  '🧍🏽‍♂️',
  '🧍🏽‍♂',
  '🧍🏾‍♂️',
  '🧍🏾‍♂',
  '🧍🏿‍♂️',
  '🧍🏿‍♂',
  '🧍‍♀️',
  '🧍‍♀',
  '🧍🏻‍♀️',
  '🧍🏻‍♀',
  '🧍🏼‍♀️',
  '🧍🏼‍♀',
  '🧍🏽‍♀️',
  '🧍🏽‍♀',
  '🧍🏾‍♀️',
  '🧍🏾‍♀',
  '🧍🏿‍♀️',
  '🧍🏿‍♀',
  '🧎',
  '🧎🏻',
  '🧎🏼',
  '🧎🏽',
  '🧎🏾',
  '🧎🏿',
  '🧎‍♂️',
  '🧎‍♂',
  '🧎🏻‍♂️',
  '🧎🏻‍♂',
  '🧎🏼‍♂️',
  '🧎🏼‍♂',
  '🧎🏽‍♂️',
  '🧎🏽‍♂',
  '🧎🏾‍♂️',
  '🧎🏾‍♂',
  '🧎🏿‍♂️',
  '🧎🏿‍♂',
  '🧎‍♀️',
  '🧎‍♀',
  '🧎🏻‍♀️',
  '🧎🏻‍♀',
  '🧎🏼‍♀️',
  '🧎🏼‍♀',
  '🧎🏽‍♀️',
  '🧎🏽‍♀',
  '🧎🏾‍♀️',
  '🧎🏾‍♀',
  '🧎🏿‍♀️',
  '🧎🏿‍♀',
  '🧑‍🦯',
  '🧑🏻‍🦯',
  '🧑🏼‍🦯',
  '🧑🏽‍🦯',
  '🧑🏾‍🦯',
  '🧑🏿‍🦯',
  '👨‍🦯',
  '👨🏻‍🦯',
  '👨🏼‍🦯',
  '👨🏽‍🦯',
  '👨🏾‍🦯',
  '👨🏿‍🦯',
  '👩‍🦯',
  '👩🏻‍🦯',
  '👩🏼‍🦯',
  '👩🏽‍🦯',
  '👩🏾‍🦯',
  '👩🏿‍🦯',
  '🧑‍🦼',
  '🧑🏻‍🦼',
  '🧑🏼‍🦼',
  '🧑🏽‍🦼',
  '🧑🏾‍🦼',
  '🧑🏿‍🦼',
  '👨‍🦼',
  '👨🏻‍🦼',
  '👨🏼‍🦼',
  '👨🏽‍🦼',
  '👨🏾‍🦼',
  '👨🏿‍🦼',
  '👩‍🦼',
  '👩🏻‍🦼',
  '👩🏼‍🦼',
  '👩🏽‍🦼',
  '👩🏾‍🦼',
  '👩🏿‍🦼',
  '🧑‍🦽',
  '🧑🏻‍🦽',
  '🧑🏼‍🦽',
  '🧑🏽‍🦽',
  '🧑🏾‍🦽',
  '🧑🏿‍🦽',
  '👨‍🦽',
  '👨🏻‍🦽',
  '👨🏼‍🦽',
  '👨🏽‍🦽',
  '👨🏾‍🦽',
  '👨🏿‍🦽',
  '👩‍🦽',
  '👩🏻‍🦽',
  '👩🏼‍🦽',
  '👩🏽‍🦽',
  '👩🏾‍🦽',
  '👩🏿‍🦽',
  '🏃',
  '🏃🏻',
  '🏃🏼',
  '🏃🏽',
  '🏃🏾',
  '🏃🏿',
  '🏃‍♂️',
  '🏃‍♂',
  '🏃🏻‍♂️',
  '🏃🏻‍♂',
  '🏃🏼‍♂️',
  '🏃🏼‍♂',
  '🏃🏽‍♂️',
  '🏃🏽‍♂',
  '🏃🏾‍♂️',
  '🏃🏾‍♂',
  '🏃🏿‍♂️',
  '🏃🏿‍♂',
  '🏃‍♀️',
  '🏃‍♀',
  '🏃🏻‍♀️',
  '🏃🏻‍♀',
  '🏃🏼‍♀️',
  '🏃🏼‍♀',
  '🏃🏽‍♀️',
  '🏃🏽‍♀',
  '🏃🏾‍♀️',
  '🏃🏾‍♀',
  '🏃🏿‍♀️',
  '🏃🏿‍♀',
  '💃',
  '💃🏻',
  '💃🏼',
  '💃🏽',
  '💃🏾',
  '💃🏿',
  '🕺',
  '🕺🏻',
  '🕺🏼',
  '🕺🏽',
  '🕺🏾',
  '🕺🏿',
  '🕴️',
  '🕴',
  '🕴🏻',
  '🕴🏼',
  '🕴🏽',
  '🕴🏾',
  '🕴🏿',
  '👯',
  '👯‍♂️',
  '👯‍♂',
  '👯‍♀️',
  '👯‍♀',
  '🧖',
  '🧖🏻',
  '🧖🏼',
  '🧖🏽',
  '🧖🏾',
  '🧖🏿',
  '🧖‍♂️',
  '🧖‍♂',
  '🧖🏻‍♂️',
  '🧖🏻‍♂',
  '🧖🏼‍♂️',
  '🧖🏼‍♂',
  '🧖🏽‍♂️',
  '🧖🏽‍♂',
  '🧖🏾‍♂️',
  '🧖🏾‍♂',
  '🧖🏿‍♂️',
  '🧖🏿‍♂',
  '🧖‍♀️',
  '🧖‍♀',
  '🧖🏻‍♀️',
  '🧖🏻‍♀',
  '🧖🏼‍♀️',
  '🧖🏼‍♀',
  '🧖🏽‍♀️',
  '🧖🏽‍♀',
  '🧖🏾‍♀️',
  '🧖🏾‍♀',
  '🧖🏿‍♀️',
  '🧖🏿‍♀',
  '🧗',
  '🧗🏻',
  '🧗🏼',
  '🧗🏽',
  '🧗🏾',
  '🧗🏿',
  '🧗‍♂️',
  '🧗‍♂',
  '🧗🏻‍♂️',
  '🧗🏻‍♂',
  '🧗🏼‍♂️',
  '🧗🏼‍♂',
  '🧗🏽‍♂️',
  '🧗🏽‍♂',
  '🧗🏾‍♂️',
  '🧗🏾‍♂',
  '🧗🏿‍♂️',
  '🧗🏿‍♂',
  '🧗‍♀️',
  '🧗‍♀',
  '🧗🏻‍♀️',
  '🧗🏻‍♀',
  '🧗🏼‍♀️',
  '🧗🏼‍♀',
  '🧗🏽‍♀️',
  '🧗🏽‍♀',
  '🧗🏾‍♀️',
  '🧗🏾‍♀',
  '🧗🏿‍♀️',
  '🧗🏿‍♀',
  '🤺',
  '🏇',
  '🏇🏻',
  '🏇🏼',
  '🏇🏽',
  '🏇🏾',
  '🏇🏿',
  '⛷️',
  '⛷',
  '🏂',
  '🏂🏻',
  '🏂🏼',
  '🏂🏽',
  '🏂🏾',
  '🏂🏿',
  '🏌️',
  '🏌',
  '🏌🏻',
  '🏌🏼',
  '🏌🏽',
  '🏌🏾',
  '🏌🏿',
  '🏌️‍♂️',
  '🏌‍♂️',
  '🏌️‍♂',
  '🏌‍♂',
  '🏌🏻‍♂️',
  '🏌🏻‍♂',
  '🏌🏼‍♂️',
  '🏌🏼‍♂',
  '🏌🏽‍♂️',
  '🏌🏽‍♂',
  '🏌🏾‍♂️',
  '🏌🏾‍♂',
  '🏌🏿‍♂️',
  '🏌🏿‍♂',
  '🏌️‍♀️',
  '🏌‍♀️',
  '🏌️‍♀',
  '🏌‍♀',
  '🏌🏻‍♀️',
  '🏌🏻‍♀',
  '🏌🏼‍♀️',
  '🏌🏼‍♀',
  '🏌🏽‍♀️',
  '🏌🏽‍♀',
  '🏌🏾‍♀️',
  '🏌🏾‍♀',
  '🏌🏿‍♀️',
  '🏌🏿‍♀',
  '🏄',
  '🏄🏻',
  '🏄🏼',
  '🏄🏽',
  '🏄🏾',
  '🏄🏿',
  '🏄‍♂️',
  '🏄‍♂',
  '🏄🏻‍♂️',
  '🏄🏻‍♂',
  '🏄🏼‍♂️',
  '🏄🏼‍♂',
  '🏄🏽‍♂️',
  '🏄🏽‍♂',
  '🏄🏾‍♂️',
  '🏄🏾‍♂',
  '🏄🏿‍♂️',
  '🏄🏿‍♂',
  '🏄‍♀️',
  '🏄‍♀',
  '🏄🏻‍♀️',
  '🏄🏻‍♀',
  '🏄🏼‍♀️',
  '🏄🏼‍♀',
  '🏄🏽‍♀️',
  '🏄🏽‍♀',
  '🏄🏾‍♀️',
  '🏄🏾‍♀',
  '🏄🏿‍♀️',
  '🏄🏿‍♀',
  '🚣',
  '🚣🏻',
  '🚣🏼',
  '🚣🏽',
  '🚣🏾',
  '🚣🏿',
  '🚣‍♂️',
  '🚣‍♂',
  '🚣🏻‍♂️',
  '🚣🏻‍♂',
  '🚣🏼‍♂️',
  '🚣🏼‍♂',
  '🚣🏽‍♂️',
  '🚣🏽‍♂',
  '🚣🏾‍♂️',
  '🚣🏾‍♂',
  '🚣🏿‍♂️',
  '🚣🏿‍♂',
  '🚣‍♀️',
  '🚣‍♀',
  '🚣🏻‍♀️',
  '🚣🏻‍♀',
  '🚣🏼‍♀️',
  '🚣🏼‍♀',
  '🚣🏽‍♀️',
  '🚣🏽‍♀',
  '🚣🏾‍♀️',
  '🚣🏾‍♀',
  '🚣🏿‍♀️',
  '🚣🏿‍♀',
  '🏊',
  '🏊🏻',
  '🏊🏼',
  '🏊🏽',
  '🏊🏾',
  '🏊🏿',
  '🏊‍♂️',
  '🏊‍♂',
  '🏊🏻‍♂️',
  '🏊🏻‍♂',
  '🏊🏼‍♂️',
  '🏊🏼‍♂',
  '🏊🏽‍♂️',
  '🏊🏽‍♂',
  '🏊🏾‍♂️',
  '🏊🏾‍♂',
  '🏊🏿‍♂️',
  '🏊🏿‍♂',
  '🏊‍♀️',
  '🏊‍♀',
  '🏊🏻‍♀️',
  '🏊🏻‍♀',
  '🏊🏼‍♀️',
  '🏊🏼‍♀',
  '🏊🏽‍♀️',
  '🏊🏽‍♀',
  '🏊🏾‍♀️',
  '🏊🏾‍♀',
  '🏊🏿‍♀️',
  '🏊🏿‍♀',
  '⛹️',
  '⛹',
  '⛹🏻',
  '⛹🏼',
  '⛹🏽',
  '⛹🏾',
  '⛹🏿',
  '⛹️‍♂️',
  '⛹‍♂️',
  '⛹️‍♂',
  '⛹‍♂',
  '⛹🏻‍♂️',
  '⛹🏻‍♂',
  '⛹🏼‍♂️',
  '⛹🏼‍♂',
  '⛹🏽‍♂️',
  '⛹🏽‍♂',
  '⛹🏾‍♂️',
  '⛹🏾‍♂',
  '⛹🏿‍♂️',
  '⛹🏿‍♂',
  '⛹️‍♀️',
  '⛹‍♀️',
  '⛹️‍♀',
  '⛹‍♀',
  '⛹🏻‍♀️',
  '⛹🏻‍♀',
  '⛹🏼‍♀️',
  '⛹🏼‍♀',
  '⛹🏽‍♀️',
  '⛹🏽‍♀',
  '⛹🏾‍♀️',
  '⛹🏾‍♀',
  '⛹🏿‍♀️',
  '⛹🏿‍♀',
  '🏋️',
  '🏋',
  '🏋🏻',
  '🏋🏼',
  '🏋🏽',
  '🏋🏾',
  '🏋🏿',
  '🏋️‍♂️',
  '🏋‍♂️',
  '🏋️‍♂',
  '🏋‍♂',
  '🏋🏻‍♂️',
  '🏋🏻‍♂',
  '🏋🏼‍♂️',
  '🏋🏼‍♂',
  '🏋🏽‍♂️',
  '🏋🏽‍♂',
  '🏋🏾‍♂️',
  '🏋🏾‍♂',
  '🏋🏿‍♂️',
  '🏋🏿‍♂',
  '🏋️‍♀️',
  '🏋‍♀️',
  '🏋️‍♀',
  '🏋‍♀',
  '🏋🏻‍♀️',
  '🏋🏻‍♀',
  '🏋🏼‍♀️',
  '🏋🏼‍♀',
  '🏋🏽‍♀️',
  '🏋🏽‍♀',
  '🏋🏾‍♀️',
  '🏋🏾‍♀',
  '🏋🏿‍♀️',
  '🏋🏿‍♀',
  '🚴',
  '🚴🏻',
  '🚴🏼',
  '🚴🏽',
  '🚴🏾',
  '🚴🏿',
  '🚴‍♂️',
  '🚴‍♂',
  '🚴🏻‍♂️',
  '🚴🏻‍♂',
  '🚴🏼‍♂️',
  '🚴🏼‍♂',
  '🚴🏽‍♂️',
  '🚴🏽‍♂',
  '🚴🏾‍♂️',
  '🚴🏾‍♂',
  '🚴🏿‍♂️',
  '🚴🏿‍♂',
  '🚴‍♀️',
  '🚴‍♀',
  '🚴🏻‍♀️',
  '🚴🏻‍♀',
  '🚴🏼‍♀️',
  '🚴🏼‍♀',
  '🚴🏽‍♀️',
  '🚴🏽‍♀',
  '🚴🏾‍♀️',
  '🚴🏾‍♀',
  '🚴🏿‍♀️',
  '🚴🏿‍♀',
  '🚵',
  '🚵🏻',
  '🚵🏼',
  '🚵🏽',
  '🚵🏾',
  '🚵🏿',
  '🚵‍♂️',
  '🚵‍♂',
  '🚵🏻‍♂️',
  '🚵🏻‍♂',
  '🚵🏼‍♂️',
  '🚵🏼‍♂',
  '🚵🏽‍♂️',
  '🚵🏽‍♂',
  '🚵🏾‍♂️',
  '🚵🏾‍♂',
  '🚵🏿‍♂️',
  '🚵🏿‍♂',
  '🚵‍♀️',
  '🚵‍♀',
  '🚵🏻‍♀️',
  '🚵🏻‍♀',
  '🚵🏼‍♀️',
  '🚵🏼‍♀',
  '🚵🏽‍♀️',
  '🚵🏽‍♀',
  '🚵🏾‍♀️',
  '🚵🏾‍♀',
  '🚵🏿‍♀️',
  '🚵🏿‍♀',
  '🤸',
  '🤸🏻',
  '🤸🏼',
  '🤸🏽',
  '🤸🏾',
  '🤸🏿',
  '🤸‍♂️',
  '🤸‍♂',
  '🤸🏻‍♂️',
  '🤸🏻‍♂',
  '🤸🏼‍♂️',
  '🤸🏼‍♂',
  '🤸🏽‍♂️',
  '🤸🏽‍♂',
  '🤸🏾‍♂️',
  '🤸🏾‍♂',
  '🤸🏿‍♂️',
  '🤸🏿‍♂',
  '🤸‍♀️',
  '🤸‍♀',
  '🤸🏻‍♀️',
  '🤸🏻‍♀',
  '🤸🏼‍♀️',
  '🤸🏼‍♀',
  '🤸🏽‍♀️',
  '🤸🏽‍♀',
  '🤸🏾‍♀️',
  '🤸🏾‍♀',
  '🤸🏿‍♀️',
  '🤸🏿‍♀',
  '🤼',
  '🤼‍♂️',
  '🤼‍♂',
  '🤼‍♀️',
  '🤼‍♀',
  '🤽',
  '🤽🏻',
  '🤽🏼',
  '🤽🏽',
  '🤽🏾',
  '🤽🏿',
  '🤽‍♂️',
  '🤽‍♂',
  '🤽🏻‍♂️',
  '🤽🏻‍♂',
  '🤽🏼‍♂️',
  '🤽🏼‍♂',
  '🤽🏽‍♂️',
  '🤽🏽‍♂',
  '🤽🏾‍♂️',
  '🤽🏾‍♂',
  '🤽🏿‍♂️',
  '🤽🏿‍♂',
  '🤽‍♀️',
  '🤽‍♀',
  '🤽🏻‍♀️',
  '🤽🏻‍♀',
  '🤽🏼‍♀️',
  '🤽🏼‍♀',
  '🤽🏽‍♀️',
  '🤽🏽‍♀',
  '🤽🏾‍♀️',
  '🤽🏾‍♀',
  '🤽🏿‍♀️',
  '🤽🏿‍♀',
  '🤾',
  '🤾🏻',
  '🤾🏼',
  '🤾🏽',
  '🤾🏾',
  '🤾🏿',
  '🤾‍♂️',
  '🤾‍♂',
  '🤾🏻‍♂️',
  '🤾🏻‍♂',
  '🤾🏼‍♂️',
  '🤾🏼‍♂',
  '🤾🏽‍♂️',
  '🤾🏽‍♂',
  '🤾🏾‍♂️',
  '🤾🏾‍♂',
  '🤾🏿‍♂️',
  '🤾🏿‍♂',
  '🤾‍♀️',
  '🤾‍♀',
  '🤾🏻‍♀️',
  '🤾🏻‍♀',
  '🤾🏼‍♀️',
  '🤾🏼‍♀',
  '🤾🏽‍♀️',
  '🤾🏽‍♀',
  '🤾🏾‍♀️',
  '🤾🏾‍♀',
  '🤾🏿‍♀️',
  '🤾🏿‍♀',
  '🤹',
  '🤹🏻',
  '🤹🏼',
  '🤹🏽',
  '🤹🏾',
  '🤹🏿',
  '🤹‍♂️',
  '🤹‍♂',
  '🤹🏻‍♂️',
  '🤹🏻‍♂',
  '🤹🏼‍♂️',
  '🤹🏼‍♂',
  '🤹🏽‍♂️',
  '🤹🏽‍♂',
  '🤹🏾‍♂️',
  '🤹🏾‍♂',
  '🤹🏿‍♂️',
  '🤹🏿‍♂',
  '🤹‍♀️',
  '🤹‍♀',
  '🤹🏻‍♀️',
  '🤹🏻‍♀',
  '🤹🏼‍♀️',
  '🤹🏼‍♀',
  '🤹🏽‍♀️',
  '🤹🏽‍♀',
  '🤹🏾‍♀️',
  '🤹🏾‍♀',
  '🤹🏿‍♀️',
  '🤹🏿‍♀',
  '🧘',
  '🧘🏻',
  '🧘🏼',
  '🧘🏽',
  '🧘🏾',
  '🧘🏿',
  '🧘‍♂️',
  '🧘‍♂',
  '🧘🏻‍♂️',
  '🧘🏻‍♂',
  '🧘🏼‍♂️',
  '🧘🏼‍♂',
  '🧘🏽‍♂️',
  '🧘🏽‍♂',
  '🧘🏾‍♂️',
  '🧘🏾‍♂',
  '🧘🏿‍♂️',
  '🧘🏿‍♂',
  '🧘‍♀️',
  '🧘‍♀',
  '🧘🏻‍♀️',
  '🧘🏻‍♀',
  '🧘🏼‍♀️',
  '🧘🏼‍♀',
  '🧘🏽‍♀️',
  '🧘🏽‍♀',
  '🧘🏾‍♀️',
  '🧘🏾‍♀',
  '🧘🏿‍♀️',
  '🧘🏿‍♀',
  '🛀',
  '🛀🏻',
  '🛀🏼',
  '🛀🏽',
  '🛀🏾',
  '🛀🏿',
  '🛌',
  '🛌🏻',
  '🛌🏼',
  '🛌🏽',
  '🛌🏾',
  '🛌🏿',
  '🧑‍🤝‍🧑',
  '🧑🏻‍🤝‍🧑🏻',
  '🧑🏻‍🤝‍🧑🏼',
  '🧑🏻‍🤝‍🧑🏽',
  '🧑🏻‍🤝‍🧑🏾',
  '🧑🏻‍🤝‍🧑🏿',
  '🧑🏼‍🤝‍🧑🏻',
  '🧑🏼‍🤝‍🧑🏼',
  '🧑🏼‍🤝‍🧑🏽',
  '🧑🏼‍🤝‍🧑🏾',
  '🧑🏼‍🤝‍🧑🏿',
  '🧑🏽‍🤝‍🧑🏻',
  '🧑🏽‍🤝‍🧑🏼',
  '🧑🏽‍🤝‍🧑🏽',
  '🧑🏽‍🤝‍🧑🏾',
  '🧑🏽‍🤝‍🧑🏿',
  '🧑🏾‍🤝‍🧑🏻',
  '🧑🏾‍🤝‍🧑🏼',
  '🧑🏾‍🤝‍🧑🏽',
  '🧑🏾‍🤝‍🧑🏾',
  '🧑🏾‍🤝‍🧑🏿',
  '🧑🏿‍🤝‍🧑🏻',
  '🧑🏿‍🤝‍🧑🏼',
  '🧑🏿‍🤝‍🧑🏽',
  '🧑🏿‍🤝‍🧑🏾',
  '🧑🏿‍🤝‍🧑🏿',
  '👭',
  '👭🏻',
  '👩🏻‍🤝‍👩🏼',
  '👩🏻‍🤝‍👩🏽',
  '👩🏻‍🤝‍👩🏾',
  '👩🏻‍🤝‍👩🏿',
  '👩🏼‍🤝‍👩🏻',
  '👭🏼',
  '👩🏼‍🤝‍👩🏽',
  '👩🏼‍🤝‍👩🏾',
  '👩🏼‍🤝‍👩🏿',
  '👩🏽‍🤝‍👩🏻',
  '👩🏽‍🤝‍👩🏼',
  '👭🏽',
  '👩🏽‍🤝‍👩🏾',
  '👩🏽‍🤝‍👩🏿',
  '👩🏾‍🤝‍👩🏻',
  '👩🏾‍🤝‍👩🏼',
  '👩🏾‍🤝‍👩🏽',
  '👭🏾',
  '👩🏾‍🤝‍👩🏿',
  '👩🏿‍🤝‍👩🏻',
  '👩🏿‍🤝‍👩🏼',
  '👩🏿‍🤝‍👩🏽',
  '👩🏿‍🤝‍👩🏾',
  '👭🏿',
  '👫',
  '👫🏻',
  '👩🏻‍🤝‍👨🏼',
  '👩🏻‍🤝‍👨🏽',
  '👩🏻‍🤝‍👨🏾',
  '👩🏻‍🤝‍👨🏿',
  '👩🏼‍🤝‍👨🏻',
  '👫🏼',
  '👩🏼‍🤝‍👨🏽',
  '👩🏼‍🤝‍👨🏾',
  '👩🏼‍🤝‍👨🏿',
  '👩🏽‍🤝‍👨🏻',
  '👩🏽‍🤝‍👨🏼',
  '👫🏽',
  '👩🏽‍🤝‍👨🏾',
  '👩🏽‍🤝‍👨🏿',
  '👩🏾‍🤝‍👨🏻',
  '👩🏾‍🤝‍👨🏼',
  '👩🏾‍🤝‍👨🏽',
  '👫🏾',
  '👩🏾‍🤝‍👨🏿',
  '👩🏿‍🤝‍👨🏻',
  '👩🏿‍🤝‍👨🏼',
  '👩🏿‍🤝‍👨🏽',
  '👩🏿‍🤝‍👨🏾',
  '👫🏿',
  '👬',
  '👬🏻',
  '👨🏻‍🤝‍👨🏼',
  '👨🏻‍🤝‍👨🏽',
  '👨🏻‍🤝‍👨🏾',
  '👨🏻‍🤝‍👨🏿',
  '👨🏼‍🤝‍👨🏻',
  '👬🏼',
  '👨🏼‍🤝‍👨🏽',
  '👨🏼‍🤝‍👨🏾',
  '👨🏼‍🤝‍👨🏿',
  '👨🏽‍🤝‍👨🏻',
  '👨🏽‍🤝‍👨🏼',
  '👬🏽',
  '👨🏽‍🤝‍👨🏾',
  '👨🏽‍🤝‍👨🏿',
  '👨🏾‍🤝‍👨🏻',
  '👨🏾‍🤝‍👨🏼',
  '👨🏾‍🤝‍👨🏽',
  '👬🏾',
  '👨🏾‍🤝‍👨🏿',
  '👨🏿‍🤝‍👨🏻',
  '👨🏿‍🤝‍👨🏼',
  '👨🏿‍🤝‍👨🏽',
  '👨🏿‍🤝‍👨🏾',
  '👬🏿',
  '💏',
  '👩‍❤️‍💋‍👨',
  '👩‍❤‍💋‍👨',
  '👨‍❤️‍💋‍👨',
  '👨‍❤‍💋‍👨',
  '👩‍❤️‍💋‍👩',
  '👩‍❤‍💋‍👩',
  '💑',
  '👩‍❤️‍👨',
  '👩‍❤‍👨',
  '👨‍❤️‍👨',
  '👨‍❤‍👨',
  '👩‍❤️‍👩',
  '👩‍❤‍👩',
  '👪',
  '👨‍👩‍👦',
  '👨‍👩‍👧',
  '👨‍👩‍👧‍👦',
  '👨‍👩‍👦‍👦',
  '👨‍👩‍👧‍👧',
  '👨‍👨‍👦',
  '👨‍👨‍👧',
  '👨‍👨‍👧‍👦',
  '👨‍👨‍👦‍👦',
  '👨‍👨‍👧‍👧',
  '👩‍👩‍👦',
  '👩‍👩‍👧',
  '👩‍👩‍👧‍👦',
  '👩‍👩‍👦‍👦',
  '👩‍👩‍👧‍👧',
  '👨‍👦',
  '👨‍👦‍👦',
  '👨‍👧',
  '👨‍👧‍👦',
  '👨‍👧‍👧',
  '👩‍👦',
  '👩‍👦‍👦',
  '👩‍👧',
  '👩‍👧‍👦',
  '👩‍👧‍👧',
  '🗣️',
  '🗣',
  '👤',
  '👥',
  '🫂',
  '👣',
  '🐵',
  '🐒',
  '🦍',
  '🦧',
  '🐶',
  '🐕',
  '🦮',
  '🐕‍🦺',
  '🐩',
  '🐺',
  '🦊',
  '🦝',
  '🐱',
  '🐈',
  '🐈‍⬛',
  '🦁',
  '🐯',
  '🐅',
  '🐆',
  '🐴',
  '🐎',
  '🦄',
  '🦓',
  '🦌',
  '🦬',
  '🐮',
  '🐂',
  '🐃',
  '🐄',
  '🐷',
  '🐖',
  '🐗',
  '🐽',
  '🐏',
  '🐑',
  '🐐',
  '🐪',
  '🐫',
  '🦙',
  '🦒',
  '🐘',
  '🦣',
  '🦏',
  '🦛',
  '🐭',
  '🐁',
  '🐀',
  '🐹',
  '🐰',
  '🐇',
  '🐿️',
  '🐿',
  '🦫',
  '🦔',
  '🦇',
  '🐻',
  '🐻‍❄️',
  '🐻‍❄',
  '🐨',
  '🐼',
  '🦥',
  '🦦',
  '🦨',
  '🦘',
  '🦡',
  '🐾',
  '🦃',
  '🐔',
  '🐓',
  '🐣',
  '🐤',
  '🐥',
  '🐦',
  '🐧',
  '🕊️',
  '🕊',
  '🦅',
  '🦆',
  '🦢',
  '🦉',
  '🦤',
  '🪶',
  '🦩',
  '🦚',
  '🦜',
  '🐸',
  '🐊',
  '🐢',
  '🦎',
  '🐍',
  '🐲',
  '🐉',
  '🦕',
  '🦖',
  '🐳',
  '🐋',
  '🐬',
  '🦭',
  '🐟',
  '🐠',
  '🐡',
  '🦈',
  '🐙',
  '🐚',
  '🐌',
  '🦋',
  '🐛',
  '🐜',
  '🐝',
  '🪲',
  '🐞',
  '🦗',
  '🪳',
  '🕷️',
  '🕷',
  '🕸️',
  '🕸',
  '🦂',
  '🦟',
  '🪰',
  '🪱',
  '🦠',
  '💐',
  '🌸',
  '💮',
  '🏵️',
  '🏵',
  '🌹',
  '🥀',
  '🌺',
  '🌻',
  '🌼',
  '🌷',
  '🌱',
  '🪴',
  '🌲',
  '🌳',
  '🌴',
  '🌵',
  '🌾',
  '🌿',
  '☘️',
  '☘',
  '🍀',
  '🍁',
  '🍂',
  '🍃',
  '🍇',
  '🍈',
  '🍉',
  '🍊',
  '🍋',
  '🍌',
  '🍍',
  '🥭',
  '🍎',
  '🍏',
  '🍐',
  '🍑',
  '🍒',
  '🍓',
  '🫐',
  '🥝',
  '🍅',
  '🫒',
  '🥥',
  '🥑',
  '🍆',
  '🥔',
  '🥕',
  '🌽',
  '🌶️',
  '🌶',
  '🫑',
  '🥒',
  '🥬',
  '🥦',
  '🧄',
  '🧅',
  '🍄',
  '🥜',
  '🌰',
  '🍞',
  '🥐',
  '🥖',
  '🫓',
  '🥨',
  '🥯',
  '🥞',
  '🧇',
  '🧀',
  '🍖',
  '🍗',
  '🥩',
  '🥓',
  '🍔',
  '🍟',
  '🍕',
  '🌭',
  '🥪',
  '🌮',
  '🌯',
  '🫔',
  '🥙',
  '🧆',
  '🥚',
  '🍳',
  '🥘',
  '🍲',
  '🫕',
  '🥣',
  '🥗',
  '🍿',
  '🧈',
  '🧂',
  '🥫',
  '🍱',
  '🍘',
  '🍙',
  '🍚',
  '🍛',
  '🍜',
  '🍝',
  '🍠',
  '🍢',
  '🍣',
  '🍤',
  '🍥',
  '🥮',
  '🍡',
  '🥟',
  '🥠',
  '🥡',
  '🦀',
  '🦞',
  '🦐',
  '🦑',
  '🦪',
  '🍦',
  '🍧',
  '🍨',
  '🍩',
  '🍪',
  '🎂',
  '🍰',
  '🧁',
  '🥧',
  '🍫',
  '🍬',
  '🍭',
  '🍮',
  '🍯',
  '🍼',
  '🥛',
  '☕',
  '🫖',
  '🍵',
  '🍶',
  '🍾',
  '🍷',
  '🍸',
  '🍹',
  '🍺',
  '🍻',
  '🥂',
  '🥃',
  '🥤',
  '🧋',
  '🧃',
  '🧉',
  '🧊',
  '🥢',
  '🍽️',
  '🍽',
  '🍴',
  '🥄',
  '🔪',
  '🏺',
  '🌍',
  '🌎',
  '🌏',
  '🌐',
  '🗺️',
  '🗺',
  '🗾',
  '🧭',
  '🏔️',
  '🏔',
  '⛰️',
  '⛰',
  '🌋',
  '🗻',
  '🏕️',
  '🏕',
  '🏖️',
  '🏖',
  '🏜️',
  '🏜',
  '🏝️',
  '🏝',
  '🏞️',
  '🏞',
  '🏟️',
  '🏟',
  '🏛️',
  '🏛',
  '🏗️',
  '🏗',
  '🧱',
  '🪨',
  '🪵',
  '🛖',
  '🏘️',
  '🏘',
  '🏚️',
  '🏚',
  '🏠',
  '🏡',
  '🏢',
  '🏣',
  '🏤',
  '🏥',
  '🏦',
  '🏨',
  '🏩',
  '🏪',
  '🏫',
  '🏬',
  '🏭',
  '🏯',
  '🏰',
  '💒',
  '🗼',
  '🗽',
  '⛪',
  '🕌',
  '🛕',
  '🕍',
  '⛩️',
  '⛩',
  '🕋',
  '⛲',
  '⛺',
  '🌁',
  '🌃',
  '🏙️',
  '🏙',
  '🌄',
  '🌅',
  '🌆',
  '🌇',
  '🌉',
  '♨️',
  '♨',
  '🎠',
  '🎡',
  '🎢',
  '💈',
  '🎪',
  '🚂',
  '🚃',
  '🚄',
  '🚅',
  '🚆',
  '🚇',
  '🚈',
  '🚉',
  '🚊',
  '🚝',
  '🚞',
  '🚋',
  '🚌',
  '🚍',
  '🚎',
  '🚐',
  '🚑',
  '🚒',
  '🚓',
  '🚔',
  '🚕',
  '🚖',
  '🚗',
  '🚘',
  '🚙',
  '🛻',
  '🚚',
  '🚛',
  '🚜',
  '🏎️',
  '🏎',
  '🏍️',
  '🏍',
  '🛵',
  '🦽',
  '🦼',
  '🛺',
  '🚲',
  '🛴',
  '🛹',
  '🛼',
  '🚏',
  '🛣️',
  '🛣',
  '🛤️',
  '🛤',
  '🛢️',
  '🛢',
  '⛽',
  '🚨',
  '🚥',
  '🚦',
  '🛑',
  '🚧',
  '⚓',
  '⛵',
  '🛶',
  '🚤',
  '🛳️',
  '🛳',
  '⛴️',
  '⛴',
  '🛥️',
  '🛥',
  '🚢',
  '✈️',
  '✈',
  '🛩️',
  '🛩',
  '🛫',
  '🛬',
  '🪂',
  '💺',
  '🚁',
  '🚟',
  '🚠',
  '🚡',
  '🛰️',
  '🛰',
  '🚀',
  '🛸',
  '🛎️',
  '🛎',
  '🧳',
  '⌛',
  '⏳',
  '⌚',
  '⏰',
  '⏱️',
  '⏱',
  '⏲️',
  '⏲',
  '🕰️',
  '🕰',
  '🕛',
  '🕧',
  '🕐',
  '🕜',
  '🕑',
  '🕝',
  '🕒',
  '🕞',
  '🕓',
  '🕟',
  '🕔',
  '🕠',
  '🕕',
  '🕡',
  '🕖',
  '🕢',
  '🕗',
  '🕣',
  '🕘',
  '🕤',
  '🕙',
  '🕥',
  '🕚',
  '🕦',
  '🌑',
  '🌒',
  '🌓',
  '🌔',
  '🌕',
  '🌖',
  '🌗',
  '🌘',
  '🌙',
  '🌚',
  '🌛',
  '🌜',
  '🌡️',
  '🌡',
  '☀️',
  '☀',
  '🌝',
  '🌞',
  '🪐',
  '⭐',
  '🌟',
  '🌠',
  '🌌',
  '☁️',
  '☁',
  '⛅',
  '⛈️',
  '⛈',
  '🌤️',
  '🌤',
  '🌥️',
  '🌥',
  '🌦️',
  '🌦',
  '🌧️',
  '🌧',
  '🌨️',
  '🌨',
  '🌩️',
  '🌩',
  '🌪️',
  '🌪',
  '🌫️',
  '🌫',
  '🌬️',
  '🌬',
  '🌀',
  '🌈',
  '🌂',
  '☂️',
  '☂',
  '☔',
  '⛱️',
  '⛱',
  '⚡',
  '❄️',
  '❄',
  '☃️',
  '☃',
  '⛄',
  '☄️',
  '☄',
  '🔥',
  '💧',
  '🌊',
  '🎃',
  '🎄',
  '🎆',
  '🎇',
  '🧨',
  '✨',
  '🎈',
  '🎉',
  '🎊',
  '🎋',
  '🎍',
  '🎎',
  '🎏',
  '🎐',
  '🎑',
  '🧧',
  '🎀',
  '🎁',
  '🎗️',
  '🎗',
  '🎟️',
  '🎟',
  '🎫',
  '🎖️',
  '🎖',
  '🏆',
  '🏅',
  '🥇',
  '🥈',
  '🥉',
  '⚽',
  '⚾',
  '🥎',
  '🏀',
  '🏐',
  '🏈',
  '🏉',
  '🎾',
  '🥏',
  '🎳',
  '🏏',
  '🏑',
  '🏒',
  '🥍',
  '🏓',
  '🏸',
  '🥊',
  '🥋',
  '🥅',
  '⛳',
  '⛸️',
  '⛸',
  '🎣',
  '🤿',
  '🎽',
  '🎿',
  '🛷',
  '🥌',
  '🎯',
  '🪀',
  '🪁',
  '🎱',
  '🔮',
  '🪄',
  '🧿',
  '🎮',
  '🕹️',
  '🕹',
  '🎰',
  '🎲',
  '🧩',
  '🧸',
  '🪅',
  '🪆',
  '♠️',
  '♠',
  '♥️',
  '♥',
  '♦️',
  '♦',
  '♣️',
  '♣',
  '♟️',
  '♟',
  '🃏',
  '🀄',
  '🎴',
  '🎭',
  '🖼️',
  '🖼',
  '🎨',
  '🧵',
  '🪡',
  '🧶',
  '🪢',
  '👓',
  '🕶️',
  '🕶',
  '🥽',
  '🥼',
  '🦺',
  '👔',
  '👕',
  '👖',
  '🧣',
  '🧤',
  '🧥',
  '🧦',
  '👗',
  '👘',
  '🥻',
  '🩱',
  '🩲',
  '🩳',
  '👙',
  '👚',
  '👛',
  '👜',
  '👝',
  '🛍️',
  '🛍',
  '🎒',
  '🩴',
  '👞',
  '👟',
  '🥾',
  '🥿',
  '👠',
  '👡',
  '🩰',
  '👢',
  '👑',
  '👒',
  '🎩',
  '🎓',
  '🧢',
  '🪖',
  '⛑️',
  '⛑',
  '📿',
  '💄',
  '💍',
  '💎',
  '🔇',
  '🔈',
  '🔉',
  '🔊',
  '📢',
  '📣',
  '📯',
  '🔔',
  '🔕',
  '🎼',
  '🎵',
  '🎶',
  '🎙️',
  '🎙',
  '🎚️',
  '🎚',
  '🎛️',
  '🎛',
  '🎤',
  '🎧',
  '📻',
  '🎷',
  '🪗',
  '🎸',
  '🎹',
  '🎺',
  '🎻',
  '🪕',
  '🥁',
  '🪘',
  '📱',
  '📲',
  '☎️',
  '☎',
  '📞',
  '📟',
  '📠',
  '🔋',
  '🔌',
  '💻',
  '🖥️',
  '🖥',
  '🖨️',
  '🖨',
  '⌨️',
  '⌨',
  '🖱️',
  '🖱',
  '🖲️',
  '🖲',
  '💽',
  '💾',
  '💿',
  '📀',
  '🧮',
  '🎥',
  '🎞️',
  '🎞',
  '📽️',
  '📽',
  '🎬',
  '📺',
  '📷',
  '📸',
  '📹',
  '📼',
  '🔍',
  '🔎',
  '🕯️',
  '🕯',
  '💡',
  '🔦',
  '🏮',
  '🪔',
  '📔',
  '📕',
  '📖',
  '📗',
  '📘',
  '📙',
  '📚',
  '📓',
  '📒',
  '📃',
  '📜',
  '📄',
  '📰',
  '🗞️',
  '🗞',
  '📑',
  '🔖',
  '🏷️',
  '🏷',
  '💰',
  '🪙',
  '💴',
  '💵',
  '💶',
  '💷',
  '💸',
  '💳',
  '🧾',
  '💹',
  '✉️',
  '✉',
  '📧',
  '📨',
  '📩',
  '📤',
  '📥',
  '📦',
  '📫',
  '📪',
  '📬',
  '📭',
  '📮',
  '🗳️',
  '🗳',
  '✏️',
  '✏',
  '✒️',
  '✒',
  '🖋️',
  '🖋',
  '🖊️',
  '🖊',
  '🖌️',
  '🖌',
  '🖍️',
  '🖍',
  '📝',
  '💼',
  '📁',
  '📂',
  '🗂️',
  '🗂',
  '📅',
  '📆',
  '🗒️',
  '🗒',
  '🗓️',
  '🗓',
  '📇',
  '📈',
  '📉',
  '📊',
  '📋',
  '📌',
  '📍',
  '📎',
  '🖇️',
  '🖇',
  '📏',
  '📐',
  '✂️',
  '✂',
  '🗃️',
  '🗃',
  '🗄️',
  '🗄',
  '🗑️',
  '🗑',
  '🔒',
  '🔓',
  '🔏',
  '🔐',
  '🔑',
  '🗝️',
  '🗝',
  '🔨',
  '🪓',
  '⛏️',
  '⛏',
  '⚒️',
  '⚒',
  '🛠️',
  '🛠',
  '🗡️',
  '🗡',
  '⚔️',
  '⚔',
  '🔫',
  '🪃',
  '🏹',
  '🛡️',
  '🛡',
  '🪚',
  '🔧',
  '🪛',
  '🔩',
  '⚙️',
  '⚙',
  '🗜️',
  '🗜',
  '⚖️',
  '⚖',
  '🦯',
  '🔗',
  '⛓️',
  '⛓',
  '🪝',
  '🧰',
  '🧲',
  '🪜',
  '⚗️',
  '⚗',
  '🧪',
  '🧫',
  '🧬',
  '🔬',
  '🔭',
  '📡',
  '💉',
  '🩸',
  '💊',
  '🩹',
  '🩺',
  '🚪',
  '🛗',
  '🪞',
  '🪟',
  '🛏️',
  '🛏',
  '🛋️',
  '🛋',
  '🪑',
  '🚽',
  '🪠',
  '🚿',
  '🛁',
  '🪤',
  '🪒',
  '🧴',
  '🧷',
  '🧹',
  '🧺',
  '🧻',
  '🪣',
  '🧼',
  '🪥',
  '🧽',
  '🧯',
  '🛒',
  '🚬',
  '⚰️',
  '⚰',
  '🪦',
  '⚱️',
  '⚱',
  '🗿',
  '🪧',
  '🏧',
  '🚮',
  '🚰',
  '♿',
  '🚹',
  '🚺',
  '🚻',
  '🚼',
  '🚾',
  '🛂',
  '🛃',
  '🛄',
  '🛅',
  '⚠️',
  '⚠',
  '🚸',
  '⛔',
  '🚫',
  '🚳',
  '🚭',
  '🚯',
  '🚱',
  '🚷',
  '📵',
  '🔞',
  '☢️',
  '☢',
  '☣️',
  '☣',
  '⬆️',
  '⬆',
  '↗️',
  '↗',
  '➡️',
  '➡',
  '↘️',
  '↘',
  '⬇️',
  '⬇',
  '↙️',
  '↙',
  '⬅️',
  '⬅',
  '↖️',
  '↖',
  '↕️',
  '↕',
  '↔️',
  '↔',
  '↩️',
  '↩',
  '↪️',
  '↪',
  '⤴️',
  '⤴',
  '⤵️',
  '⤵',
  '🔃',
  '🔄',
  '🔙',
  '🔚',
  '🔛',
  '🔜',
  '🔝',
  '🛐',
  '⚛️',
  '⚛',
  '🕉️',
  '🕉',
  '✡️',
  '✡',
  '☸️',
  '☸',
  '☯️',
  '☯',
  '✝️',
  '✝',
  '☦️',
  '☦',
  '☪️',
  '☪',
  '☮️',
  '☮',
  '🕎',
  '🔯',
  '♈',
  '♉',
  '♊',
  '♋',
  '♌',
  '♍',
  '♎',
  '♏',
  '♐',
  '♑',
  '♒',
  '♓',
  '⛎',
  '🔀',
  '🔁',
  '🔂',
  '▶️',
  '▶',
  '⏩',
  '⏭️',
  '⏭',
  '⏯️',
  '⏯',
  '◀️',
  '◀',
  '⏪',
  '⏮️',
  '⏮',
  '🔼',
  '⏫',
  '🔽',
  '⏬',
  '⏸️',
  '⏸',
  '⏹️',
  '⏹',
  '⏺️',
  '⏺',
  '⏏️',
  '⏏',
  '🎦',
  '🔅',
  '🔆',
  '📶',
  '📳',
  '📴',
  '♀️',
  '♀',
  '♂️',
  '♂',
  '⚧️',
  '⚧',
  '✖️',
  '✖',
  '➕',
  '➖',
  '➗',
  '♾️',
  '♾',
  '‼️',
  '‼',
  '⁉️',
  '⁉',
  '❓',
  '❔',
  '❕',
  '❗',
  '〰️',
  '〰',
  '💱',
  '💲',
  '⚕️',
  '⚕',
  '♻️',
  '♻',
  '⚜️',
  '⚜',
  '🔱',
  '📛',
  '🔰',
  '⭕',
  '✅',
  '☑️',
  '☑',
  '✔️',
  '✔',
  '❌',
  '❎',
  '➰',
  '➿',
  '〽️',
  '〽',
  '✳️',
  '✳',
  '✴️',
  '✴',
  '❇️',
  '❇',
  '©️',
  '©',
  '®️',
  '®',
  '™️',
  '™',
  '#️⃣',
  '#⃣',
  '*️⃣',
  '*⃣',
  '0️⃣',
  '0⃣',
  '1️⃣',
  '1⃣',
  '2️⃣',
  '2⃣',
  '3️⃣',
  '3⃣',
  '4️⃣',
  '4⃣',
  '5️⃣',
  '5⃣',
  '6️⃣',
  '6⃣',
  '7️⃣',
  '7⃣',
  '8️⃣',
  '8⃣',
  '9️⃣',
  '9⃣',
  '🔟',
  '🔠',
  '🔡',
  '🔢',
  '🔣',
  '🔤',
  '🅰️',
  '🅰',
  '🆎',
  '🅱️',
  '🅱',
  '🆑',
  '🆒',
  '🆓',
  'ℹ️',
  'ℹ',
  '🆔',
  'Ⓜ️',
  'Ⓜ',
  '🆕',
  '🆖',
  '🅾️',
  '🅾',
  '🆗',
  '🅿️',
  '🅿',
  '🆘',
  '🆙',
  '🆚',
  '🈁',
  '🈂️',
  '🈂',
  '🈷️',
  '🈷',
  '🈶',
  '🈯',
  '🉐',
  '🈹',
  '🈚',
  '🈲',
  '🉑',
  '🈸',
  '🈴',
  '🈳',
  '㊗️',
  '㊗',
  '㊙️',
  '㊙',
  '🈺',
  '🈵',
  '🔴',
  '🟠',
  '🟡',
  '🟢',
  '🔵',
  '🟣',
  '🟤',
  '⚫',
  '⚪',
  '🟥',
  '🟧',
  '🟨',
  '🟩',
  '🟦',
  '🟪',
  '🟫',
  '⬛',
  '⬜',
  '◼️',
  '◼',
  '◻️',
  '◻',
  '◾',
  '◽',
  '▪️',
  '▪',
  '▫️',
  '▫',
  '🔶',
  '🔷',
  '🔸',
  '🔹',
  '🔺',
  '🔻',
  '💠',
  '🔘',
  '🔳',
  '🔲',
  '🏁',
  '🚩',
  '🎌',
  '🏴',
  '🏳️',
  '🏳',
  '🏳️‍🌈',
  '🏳‍🌈',
  '🏳️‍⚧️',
  '🏳‍⚧️',
  '🏳️‍⚧',
  '🏳‍⚧',
  '🏴‍☠️',
  '🏴‍☠',
  '🇦🇨',
  '🇦🇩',
  '🇦🇪',
  '🇦🇫',
  '🇦🇬',
  '🇦🇮',
  '🇦🇱',
  '🇦🇲',
  '🇦🇴',
  '🇦🇶',
  '🇦🇷',
  '🇦🇸',
  '🇦🇹',
  '🇦🇺',
  '🇦🇼',
  '🇦🇽',
  '🇦🇿',
  '🇧🇦',
  '🇧🇧',
  '🇧🇩',
  '🇧🇪',
  '🇧🇫',
  '🇧🇬',
  '🇧🇭',
  '🇧🇮',
  '🇧🇯',
  '🇧🇱',
  '🇧🇲',
  '🇧🇳',
  '🇧🇴',
  '🇧🇶',
  '🇧🇷',
  '🇧🇸',
  '🇧🇹',
  '🇧🇻',
  '🇧🇼',
  '🇧🇾',
  '🇧🇿',
  '🇨🇦',
  '🇨🇨',
  '🇨🇩',
  '🇨🇫',
  '🇨🇬',
  '🇨🇭',
  '🇨🇮',
  '🇨🇰',
  '🇨🇱',
  '🇨🇲',
  '🇨🇳',
  '🇨🇴',
  '🇨🇵',
  '🇨🇷',
  '🇨🇺',
  '🇨🇻',
  '🇨🇼',
  '🇨🇽',
  '🇨🇾',
  '🇨🇿',
  '🇩🇪',
  '🇩🇬',
  '🇩🇯',
  '🇩🇰',
  '🇩🇲',
  '🇩🇴',
  '🇩🇿',
  '🇪🇦',
  '🇪🇨',
  '🇪🇪',
  '🇪🇬',
  '🇪🇭',
  '🇪🇷',
  '🇪🇸',
  '🇪🇹',
  '🇪🇺',
  '🇫🇮',
  '🇫🇯',
  '🇫🇰',
  '🇫🇲',
  '🇫🇴',
  '🇫🇷',
  '🇬🇦',
  '🇬🇧',
  '🇬🇩',
  '🇬🇪',
  '🇬🇫',
  '🇬🇬',
  '🇬🇭',
  '🇬🇮',
  '🇬🇱',
  '🇬🇲',
  '🇬🇳',
  '🇬🇵',
  '🇬🇶',
  '🇬🇷',
  '🇬🇸',
  '🇬🇹',
  '🇬🇺',
  '🇬🇼',
  '🇬🇾',
  '🇭🇰',
  '🇭🇲',
  '🇭🇳',
  '🇭🇷',
  '🇭🇹',
  '🇭🇺',
  '🇮🇨',
  '🇮🇩',
  '🇮🇪',
  '🇮🇱',
  '🇮🇲',
  '🇮🇳',
  '🇮🇴',
  '🇮🇶',
  '🇮🇷',
  '🇮🇸',
  '🇮🇹',
  '🇯🇪',
  '🇯🇲',
  '🇯🇴',
  '🇯🇵',
  '🇰🇪',
  '🇰🇬',
  '🇰🇭',
  '🇰🇮',
  '🇰🇲',
  '🇰🇳',
  '🇰🇵',
  '🇰🇷',
  '🇰🇼',
  '🇰🇾',
  '🇰🇿',
  '🇱🇦',
  '🇱🇧',
  '🇱🇨',
  '🇱🇮',
  '🇱🇰',
  '🇱🇷',
  '🇱🇸',
  '🇱🇹',
  '🇱🇺',
  '🇱🇻',
  '🇱🇾',
  '🇲🇦',
  '🇲🇨',
  '🇲🇩',
  '🇲🇪',
  '🇲🇫',
  '🇲🇬',
  '🇲🇭',
  '🇲🇰',
  '🇲🇱',
  '🇲🇲',
  '🇲🇳',
  '🇲🇴',
  '🇲🇵',
  '🇲🇶',
  '🇲🇷',
  '🇲🇸',
  '🇲🇹',
  '🇲🇺',
  '🇲🇻',
  '🇲🇼',
  '🇲🇽',
  '🇲🇾',
  '🇲🇿',
  '🇳🇦',
  '🇳🇨',
  '🇳🇪',
  '🇳🇫',
  '🇳🇬',
  '🇳🇮',
  '🇳🇱',
  '🇳🇴',
  '🇳🇵',
  '🇳🇷',
  '🇳🇺',
  '🇳🇿',
  '🇴🇲',
  '🇵🇦',
  '🇵🇪',
  '🇵🇫',
  '🇵🇬',
  '🇵🇭',
  '🇵🇰',
  '🇵🇱',
  '🇵🇲',
  '🇵🇳',
  '🇵🇷',
  '🇵🇸',
  '🇵🇹',
  '🇵🇼',
  '🇵🇾',
  '🇶🇦',
  '🇷🇪',
  '🇷🇴',
  '🇷🇸',
  '🇷🇺',
  '🇷🇼',
  '🇸🇦',
  '🇸🇧',
  '🇸🇨',
  '🇸🇩',
  '🇸🇪',
  '🇸🇬',
  '🇸🇭',
  '🇸🇮',
  '🇸🇯',
  '🇸🇰',
  '🇸🇱',
  '🇸🇲',
  '🇸🇳',
  '🇸🇴',
  '🇸🇷',
  '🇸🇸',
  '🇸🇹',
  '🇸🇻',
  '🇸🇽',
  '🇸🇾',
  '🇸🇿',
  '🇹🇦',
  '🇹🇨',
  '🇹🇩',
  '🇹🇫',
  '🇹🇬',
  '🇹🇭',
  '🇹🇯',
  '🇹🇰',
  '🇹🇱',
  '🇹🇲',
  '🇹🇳',
  '🇹🇴',
  '🇹🇷',
  '🇹🇹',
  '🇹🇻',
  '🇹🇼',
  '🇹🇿',
  '🇺🇦',
  '🇺🇬',
  '🇺🇲',
  '🇺🇳',
  '🇺🇸',
  '🇺🇾',
  '🇺🇿',
  '🇻🇦',
  '🇻🇨',
  '🇻🇪',
  '🇻🇬',
  '🇻🇮',
  '🇻🇳',
  '🇻🇺',
  '🇼🇫',
  '🇼🇸',
  '🇽🇰',
  '🇾🇪',
  '🇾🇹',
  '🇿🇦',
  '🇿🇲',
  '🇿🇼',
  '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
];
export const emojis = delimList(emojiList);
