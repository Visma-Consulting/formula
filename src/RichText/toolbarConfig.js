const { useIntl } = require('react-intl');


const useToolbarConfig = () => {
  const intl = useIntl();

  return {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_ALIGNMENT_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
      { label: intl.formatMessage({ defaultMessage: 'Lihavoitu' }), style: 'BOLD' },
      { label: intl.formatMessage({ defaultMessage: 'Kursivoitu' }), style: 'ITALIC' },
      { label: intl.formatMessage({ defaultMessage: 'Yliviivaus' }), style: 'STRIKETHROUGH' },
      { label: intl.formatMessage({ defaultMessage: 'Tasalevyinen' }), style: 'CODE' },

    ],
    BLOCK_TYPE_BUTTONS: [
      { label: intl.formatMessage({ defaultMessage: 'Luettelo' }), style: 'unordered-list-item' },
      { label: intl.formatMessage({ defaultMessage: 'Numeroitu luettelo' }), style: 'ordered-list-item' },
      { label: intl.formatMessage({ defaultMessage: 'Lainaus' }), style: 'blockquote' },

    ],

    BLOCK_TYPE_DROPDOWN: [
      { label: intl.formatMessage({ defaultMessage: 'Normaali' }), style: 'unstyled' },
      { label: intl.formatMessage({ defaultMessage: 'Otsikko suuri' }), style: 'header-one' },
      { label: intl.formatMessage({ defaultMessage: 'Otsikko keskikokoinen' }), style: 'header-two' },
      { label: intl.formatMessage({ defaultMessage: 'Otsikko pieni' }), style: 'header-three' }
    ],
    HISTORY_BUTTONS: {
      undo: {
        label: intl.formatMessage({ defaultMessage: 'Kumoa' }),
        style: 'UNDO',
      },
      redo: {
        label: intl.formatMessage({ defaultMessage: 'Tee uudelleen' }),
        style: 'REDO',
      },
    },
    LINK_BUTTONS: {
      link: {
        label: intl.formatMessage({ defaultMessage: 'Linkki' }),
        style: 'LINK',
      },
      removeLink: {
        label: intl.formatMessage({ defaultMessage: 'Poista linkki' }),
        style: 'REMOVE-LINK',
      },
    },
  }

};

export default useToolbarConfig;
