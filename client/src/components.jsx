
export {
  LinkButton,
  OnClickButton,
}


const LinkButton = ({ className, href, children }) => {
  return (
    <a className={className} href={href} >
      {children}
    </a>
  );
};


const OnClickButton = ({ className, onClick, children }) => {
  return (
    <a className={className} onClick={onClick} >
      {children}
    </a>
  );
};