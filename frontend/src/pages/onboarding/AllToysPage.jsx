import CategoryItemsPage from './CategoryItemsPage'

import Baby1 from '../../assets/Baby1.png'
import Baby2 from '../../assets/Baby2.png'
import Baby3 from '../../assets/Baby3.png'

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
          image: Baby1,
        },
        {
          id: 2,
          title: 'Baby play mat',
          category: 'Toys',
          donor: 'kevin88',
          location: 'La Verne • 7 miles',
          posted: '4 days ago',
          image: Baby2,
        },
        {
          id: 3,
          title: 'Learning house toy',
          category: 'Toys',
          donor: 'parenthelp',
          location: 'Claremont • 8 miles',
          posted: '1 week ago',
          image: Baby3,
        },
        {
          id: 4,
          title: 'Rainbow blocks',
          category: 'Toys',
          donor: 'lucy11',
          location: 'Chino • 10 miles',
          posted: '3 days ago',
          image: Baby1,
        },
        {
          id: 5,
          title: 'Activity toy set',
          category: 'Toys',
          donor: 'maria22',
          location: 'Pomona • 4 miles',
          posted: '2 days ago',
          image: Baby1,
        },
        {
          id: 6,
          title: 'Baby play mat',
          category: 'Toys',
          donor: 'kevin88',
          location: 'La Verne • 7 miles',
          posted: '4 days ago',
          image: Baby2,
        },
      ]}
    />
  )
}

export default AllToysPage