
export {
  ContainerDiv,
  LinkButton,
  OnClickButton,
  HeartMark,
}


function ContainerDiv({ addClass, children }) {
  let className = "container"
  if (addClass) {
    className += ` ${addClass}`
  }

  return (
    <div className={ className }>
      { children }
    </div>
  )
}


const LinkButton = ({ className, href, children }) => {
  return (
    <a className={className} href={href} >
      {children}
    </a>
  );
}


const OnClickButton = ({ className, onClick, children }) => {
  return (
    <button className={className} onClick={onClick} >
      {children}
    </button>
  );
}


const HeartMark = () => {
  return (
    <div className="heart-mark">
      ♥
    </div>
  )
}