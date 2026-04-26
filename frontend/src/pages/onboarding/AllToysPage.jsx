import CategoryItemsPage from './CategoryItemsPage'

import image5 from '../../assets/image5.png'
import image6 from '../../assets/image6.png'
import image7 from '../../assets/image7.png'
import image8 from '../../assets/image8.png'

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
          image: image5,
        },
        {
          id: 2,
          title: 'Baby play mat',
          category: 'Toys',
          donor: 'kevin88',
          location: 'La Verne • 7 miles',
          posted: '4 days ago',
          image: image6,
        },
        {
          id: 3,
          title: 'Learning house toy',
          category: 'Toys',
          donor: 'parenthelp',
          location: 'Claremont • 8 miles',
          posted: '1 week ago',
          image: image7,
        },
        {
          id: 4,
          title: 'Rainbow blocks',
          category: 'Toys',
          donor: 'lucy11',
          location: 'Chino • 10 miles',
          posted: '3 days ago',
          image: image8,
        },
        {
          id: 5,
          title: 'Activity toy set',
          category: 'Toys',
          donor: 'maria22',
          location: 'Pomona • 4 miles',
          posted: '2 days ago',
          image: image5,
        },
        {
          id: 6,
          title: 'Baby play mat',
          category: 'Toys',
          donor: 'kevin88',
          location: 'La Verne • 7 miles',
          posted: '4 days ago',
          image: image6,
        },
      ]}
    />
  )
}

export default AllToysPage