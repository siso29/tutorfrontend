import { usePreferences } from '../context/PreferencesContext';

export default function TutorPortrait({ tutor, className = '' }) {
  const { lowData, t } = usePreferences();
  const source = tutor?.photoUrl || tutor?.photo_url;
  const initials = tutor?.initials || tutor?.name?.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'TC';
  if (source && !lowData) {
    return <div className={className}><img src={source} alt={`${tutor.name || 'Tutor'} profile`} loading="lazy" decoding="async" /></div>;
  }
  return <div className={className} title={source && lowData ? t('noPhoto') : undefined}>{initials}</div>;
}
