const Page = (Content, Cols) => {

	const getClassName = () => {
		return 'row row-cols-' + Cols + ' g-4';
	}
  
  return (
    <main role="main" className="container">
      <div className={getClassName()} id="card-container">
        <Content />
      </div>
    </main>
  )

}

export default Page;