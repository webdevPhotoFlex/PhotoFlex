const styles = {
  sharedContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
  },
  dimensionInputContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  dimensionInput: (theme) => ({
    width: '60px',
    margin: '0 5px',
    padding: '5px',
    fontSize: '16px',
    backgroundColor: theme === 'dark' ? '#333' : '#fff',
    color: theme === 'dark' ? '#fff' : '#333',
    border: `1px solid ${theme === 'dark' ? '#fff' : '#333'}`,
  }),
  label: (theme) => ({
    fontSize: '24px',
    color: theme === 'dark' ? '#fff' : '#333',
    margin: '0 5px',
  }),
  cropItemStyle: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    margin: '5px 0',
  },
  cropIconStyle: (theme) => ({
    fontSize: '96px',
    color: theme === 'dark' ? '#fff' : '#333',
    marginRight: '12px',
  }),
  button: {
    padding: '20px 25px',
    fontSize: '14px',
    backgroundColor: '#884f9f',
    color: 'white',
    border: 'none',
    borderRadius: '40px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default styles;
