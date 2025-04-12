export const ADMIN_AUTH_TOKEN = "shopcloud-admin-access-token";
export const CUSTOMER_AUTH_TOKEN = "shopcloud-customer-access-token";
export const SPECIAL_SHIPPING_AREA = [
    ["Ma Wan", "馬灣"],
    ["Discovery Bay", "愉景灣"]
]
export const RICH_TEXT_EDITOR_TOOBAR = {
    options: ['inline', 'blockType', 'colorPicker', 'fontSize', 'fontFamily', 'list', 'textAlign', 'emoji',],
    inline: {
        inDropdown: false,
        options: ['bold', 'italic', 'underline'],
    },
    blockType: {
        inDropdown: true,
        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
    },
    fontSize: {
        options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
    },
    fontFamily: {
        options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
    },
    list: {
        inDropdown: false,
        options: ['unordered', 'ordered', 'indent', 'outdent'],
    },
    textAlign: {
        inDropdown: false,
        options: ['left', 'center', 'right', 'justify'],
    },
    emoji: {
        emojis: [
            '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
            '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
            '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
            '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
            '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
            '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
            '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
            '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
            '✅', '❎', '💯',
        ],
    },
}
