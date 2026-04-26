import CategoryItemsPage from './CategoryItemsPage'

import image9 from '../../assets/image9.png'
import image10 from '../../assets/image10.png'
import image11 from '../../assets/image11.png'
import image12 from '../../assets/image12.png'

function AllFeedingPage() {
  return (
    <CategoryItemsPage
      breadcrumb={
        <>
          Recommended/<strong>All feeding</strong>
        </>
      }
      pageTitle="All Feeding"
      items={[
        {
          id: 1,
          title: 'Bottle bundle',
          category: 'Feeding',
          donor: 'caremom1',
          location: 'Pomona • 5 miles',
          posted: '2 days ago',
          image: image9,
        },
        {
          id: 2,
          title: 'Feeding essentials',
          category: 'Feeding',
          donor: 'amy77',
          location: 'Montclair • 9 miles',
          posted: '6 days ago',
          image: image10,
        },
        {
          id: 3,
          title: 'Breast pump supplies',
          category: 'Feeding',
          donor: 'rosa12',
          location: 'Upland • 11 miles',
          posted: '1 week ago',
          image: image11,
        },
        {
          id: 4,
          title: 'Milk storage set',
          category: 'Feeding',
          donor: 'linda34',
          location: 'Ontario • 14 miles',
          posted: '5 days ago',
          image: image12,
        },
        {
          id: 5,
          title: 'Bottle bundle',
          category: 'Feeding',
          donor: 'caremom1',
          location: 'Pomona • 5 miles',
          posted: '2 days ago',
          image: image9,
        },
        {
          id: 6,
          title: 'Feeding essentials',
          category: 'Feeding',
          donor: 'amy77',
          location: 'Montclair • 9 miles',
          posted: '6 days ago',
          image: image10,
        },
      ]}
    />
  )
}

export default AllFeedingPage