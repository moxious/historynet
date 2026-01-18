import { useGraph } from '@contexts';
import SearchBox from './SearchBox';
import DatasetSelector from './DatasetSelector';
import ThemeToggle from './ThemeToggle';
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
        <h1 className="header__title">Scenius</h1>
        <span className="header__tagline">Mapping collective genius</span>
      </div>
      <div className="header__controls">
        <div className="header__dataset-group">
          <span className="header__dataset-label">Dataset:</span>
          <DatasetSelector
            currentDatasetId={currentDatasetId}
            onSelect={switchDataset}
            isLoading={loadingState === 'loading'}
          />
        </div>
        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Highlight nodes..."
          resultCount={searchTerm ? searchMatchCount : undefined}
        />
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Header;
