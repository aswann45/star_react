import { MdMoneyOff } from 'react-icons/md';

function ProjectExcludeButton({ table, row, stage }) {

  const handleClick = (e) => {
    table.options.meta?.removeProjects([row.original.ID], stage);
  };

  return(
    <>
      <span
        {...{
          className: 'ProjectExcludeButton',
          onClick: (e) => handleClick(),
          style: {cursor: 'pointer'},
          title: 'Exclude project from bill.'
          //size: 'sm',
        }}
      >
        <MdMoneyOff style={{display: 'block'}} />
      </span>
    </>
  );
}

export default ProjectExcludeButton;
