import { useEffect, useState } from 'react';
import { Button, Dropdown, Search } from '@ui';
import { cx } from '@/utils';
import { StreamTeaser } from '../StreamTeaser/StreamTeaser';
import styles from './StreamTeasersList.module.scss';
import { useStreamTeasersState } from '../../hooks';
import { selectTeasersMenu, tes } from '../../config';
import { FormattedTeaser } from '../../types';

function StreamTeasersList() {
  const streamTeasersToExpand = 3;
  const streamTeasers = useStreamTeasersState();
  const [teasers, setTeasers] = useState<FormattedTeaser[]>([]);

  const [showedTeasers, setShowedTeasers] = useState<FormattedTeaser[]>([]);

  useEffect(() => {
    setTeasers(Object.keys(tes).map((key) => tes[key]));
  }, [streamTeasers]);

  useEffect(() => {
    setShowedTeasers(teasers.slice(0, streamTeasersToExpand));
  }, [teasers, streamTeasersToExpand]);

  const handleExpandPage = () => {
    const lastShowedTeaser = showedTeasers.length - 1;

    setShowedTeasers((prev) => [...prev, ...teasers.slice(lastShowedTeaser, lastShowedTeaser + streamTeasersToExpand)]);
  };

  const handleChangedSearchedValue = (e: any) => {
    const foundTeasers = teasers.filter((teaser) => teaser.title.toLowerCase().includes(e.target.value.toLowerCase()));

    setShowedTeasers(foundTeasers);
  };

  return (
    <div className={cx(styles.container)}>
      <div className={cx(styles.header)}>
        <Dropdown label="All streams" menu={selectTeasersMenu} activeValue={selectTeasersMenu.all.value} />
        <Search onChange={handleChangedSearchedValue} />
      </div>
      <div className={cx(styles.content)}>
        {showedTeasers.map((item) => (
          <StreamTeaser key={item.title + item.description + item.timestamp} {...item} />
        ))}
      </div>
      {showedTeasers.length <= teasers.length && (
        <div className={cx(styles['view-more-button-wrapper'])}>
          <Button variant="outline" size="medium" label="View More" onClick={handleExpandPage} />
        </div>
      )}
    </div>
  );
}

export { StreamTeasersList };
