import { useGraph } from '@contexts';
import SearchBox from './SearchBox';
import DatasetSelector from './DatasetSelector';
import './Header.css';

function Header() {
  const {
    currentDatasetId,
    switchDataset,
    loadingState,
    searchTerm,
    setSearchTerm,
    searchMatchCount,
  } = useGraph();

  return (
    <header className="header">
      <div className="header__brand">
        <h1 className="header__title">HistoryNet</h1>
        <span className="header__tagline">Historical Network Explorer</span>
      </div>
      <div className="header__controls">
        <DatasetSelector
          currentDatasetId={currentDatasetId}
          onSelect={switchDataset}
          isLoading={loadingState === 'loading'}
        />
        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search nodes..."
          resultCount={searchTerm ? searchMatchCount : undefined}
        />
      </div>
    </header>
  );
}

export default Header;
