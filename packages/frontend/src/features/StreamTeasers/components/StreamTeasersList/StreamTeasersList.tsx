import { useEffect, useState } from 'react';
import { Button, Dropdown, Search } from '@ui';
import { cx } from '@/utils';
import { StreamTeaser } from '../StreamTeaser/StreamTeaser';
import styles from './StreamTeasersList.module.scss';
import { useStreamTeasersState } from '../../hooks';
import { selectTeasersMenu, tes } from '../../config';
import { FormattedTeaser } from '../../types';
import { StreamTeasersListProps } from './StreamTeasersList.interfaces';

function StreamTeasersList({ initialTeasersCount = 6, streamTeasersToExpand = 3 }: StreamTeasersListProps) {
  const streamTeasers = useStreamTeasersState();
  const [teasers, setTeasers] = useState<FormattedTeaser[]>([]);
  const [showedTeasersCount, setShowedTeasersCount] = useState<number>(initialTeasersCount);
  const [searchedValue, setSearchedValue] = useState<string>('');
  const [showedTeasers, setShowedTeasers] = useState<FormattedTeaser[]>([]);

  useEffect(() => {
    setTeasers(Object.keys(tes).map((key) => tes[key]));
  }, [streamTeasers]);

  const handleExpandPage = () => {
    setShowedTeasersCount((prev) => prev + streamTeasersToExpand);
  };

  const handleChangedSearchedValue = (e: any) => {
    setSearchedValue(e.target.value);
    const foundTeasers = teasers.filter((teaser) => teaser.title.toLowerCase().includes(e.target.value.toLowerCase()));

    setShowedTeasers(foundTeasers);
  };

  useEffect(() => {
    const foundTeasers = teasers.filter((teaser) => teaser.title.toLowerCase().includes(searchedValue.toLowerCase()));

    setShowedTeasers(foundTeasers);
    setShowedTeasersCount(initialTeasersCount);
  }, [searchedValue, teasers, initialTeasersCount]);

  const handleSelectTypeOfStreams = ({ value }: (typeof selectTeasersMenu)[keyof typeof selectTeasersMenu]) => {
    console.log(value); //TODO connect the data
  };

  return (
    <div className={cx(styles.container)}>
      <div className={cx(styles.header)}>
        <Dropdown
          label="All streams"
          menu={selectTeasersMenu}
          activeValue={selectTeasersMenu.all.value}
          onItemClick={handleSelectTypeOfStreams}
        />
        <Search onChange={handleChangedSearchedValue} />
      </div>
      <div className={cx(styles.content)}>
        {showedTeasers.slice(0, showedTeasersCount).map((item) => (
          <StreamTeaser key={item.title + item.description + item.timestamp} {...item} />
        ))}
      </div>
      {!showedTeasers.length && searchedValue ? (
        <h3 className={cx(styles['no-streams-found'])}>No streams found</h3>
      ) : null}
      {showedTeasersCount <= showedTeasers.length && (
        <div className={cx(styles['view-more-button-wrapper'])}>
          <Button variant="outline" size="medium" label="View More" onClick={handleExpandPage} />
        </div>
      )}
    </div>
  );
}

export { StreamTeasersList };
