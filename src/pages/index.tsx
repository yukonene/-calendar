import { EventsProvider } from '@/components/EventsProvider';
import { Main } from '@/components/Main';

export default function HomePage() {
  return (
    <EventsProvider>
      <Main />;
    </EventsProvider>
  );
}
