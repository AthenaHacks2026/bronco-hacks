import CategoryItemsPage from './CategoryItemsPage'

function AllToysPage() {
  return (
    <CategoryItemsPage
      breadcrumb={
        <>
          Recommended/<strong>All toys</strong>
        </>
      }
      pageTitle="All Toys"
      items={[
        {
          id: 1,
          title: 'Activity toy set',
          category: 'Toys',
          donor: 'maria22',
          location: 'Pomona • 4 miles',
          posted: '2 days ago',
          image: '/images/toys1.jpg',
        },
        {
          id: 2,
          title: 'Baby play mat',
          category: 'Toys',
          donor: 'kevin88',
          location: 'La Verne • 7 miles',
          posted: '4 days ago',
          image: '/images/toys2.jpg',
        },
        {
          id: 3,
          title: 'Learning house toy',
          category: 'Toys',
          donor: 'parenthelp',
          location: 'Claremont • 8 miles',
          posted: '1 week ago',
          image: '/images/toys3.jpg',
        },
        {
          id: 4,
          title: 'Rainbow blocks',
          category: 'Toys',
          donor: 'lucy11',
          location: 'Chino • 10 miles',
          posted: '3 days ago',
          image: '/images/toys4.jpg',
        },
        {
          id: 5,
          title: 'Activity toy set',
          category: 'Toys',
          donor: 'maria22',
          location: 'Pomona • 4 miles',
          posted: '2 days ago',
          image: '/images/toys1.jpg',
        },
        {
          id: 6,
          title: 'Baby play mat',
          category: 'Toys',
          donor: 'kevin88',
          location: 'La Verne • 7 miles',
          posted: '4 days ago',
          image: '/images/toys2.jpg',
        },
      ]}
    />
  )
}

export default AllToysPage