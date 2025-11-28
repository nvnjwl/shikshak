/**
 * Shikshak Verbose Logger
 * 
 * Centralized logging system that can be enabled/disabled globally
 * Control via: window.__VERBOSE_LOG__ = true/false
 * 
 * Usage:
 * import logger from './utils/logger';
 * logger.info('Component', 'User logged in', { userId: 123 });
 * logger.error('API', 'Failed to fetch', error);
 */

class Logger {
    constructor() {
        this.colors = {
            info: '#2196F3',      // Blue
            success: '#4CAF50',   // Green
            warning: '#FF9800',   // Orange
            error: '#F44336',     // Red
            debug: '#9C27B0',     // Purple
            api: '#00BCD4',       // Cyan
            firebase: '#FFA726',  // Deep Orange
            navigation: '#8BC34A', // Light Green
            state: '#E91E63',     // Pink
            ai: '#673AB7'         // Deep Purple
        };
    }

    /**
     * Check if verbose logging is enabled
     */
    isEnabled() {
        return window.__VERBOSE_LOG__ !== false; // Default is true
    }

    /**
     * Format timestamp
     */
    getTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString('en-IN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3
        });
    }

    /**
     * Core logging function
     */
    log(level, category, message, data = null) {
        if (!this.isEnabled()) return;

        const timestamp = this.getTimestamp();
        const color = this.colors[level] || this.colors.info;
        const emoji = this.getEmoji(level);

        // Format the log message
        const prefix = `%c${emoji} [${timestamp}] [${category}]`;
        const style = `color: ${color}; font-weight: bold;`;

        if (data) {
            console.log(prefix, style, message, data);
        } else {
            console.log(prefix, style, message);
        }
    }

    /**
     * Get emoji for log level
     */
    getEmoji(level) {
        const emojis = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            debug: '🔍',
            api: '🌐',
            firebase: '🔥',
            navigation: '🧭',
            state: '📦',
            ai: '🤖'
        };
        return emojis[level] || 'ℹ️';
    }

    /**
     * Info level logging
     */
    info(category, message, data) {
        this.log('info', category, message, data);
    }

    /**
     * Success level logging
     */
    success(category, message, data) {
        this.log('success', category, message, data);
    }

    /**
     * Warning level logging
     */
    warning(category, message, data) {
        this.log('warning', category, message, data);
    }

    /**
     * Error level logging
     */
    error(category, message, data) {
        this.log('error', category, message, data);

        // Always log errors to console.error for stack traces
        if (data instanceof Error) {
            console.error(data);
        }
    }

    /**
     * Debug level logging
     */
    debug(category, message, data) {
        this.log('debug', category, message, data);
    }

    /**
     * API call logging
     */
    api(method, endpoint, data) {
        this.log('api', 'API', `${method} ${endpoint}`, data);
    }

    /**
     * Firebase operation logging
     */
    firebase(operation, collection, data) {
        this.log('firebase', 'Firebase', `${operation} ${collection}`, data);
    }

    /**
     * Navigation logging
     */
    navigation(from, to, data) {
        this.log('navigation', 'Navigation', `${from} → ${to}`, data);
    }

    /**
     * State change logging
     */
    state(component, action, data) {
        this.log('state', component, action, data);
    }

    /**
     * AI interaction logging
     */
    ai(action, data) {
        this.log('ai', 'Gemini AI', action, data);
    }

    /**
     * Component lifecycle logging
     */
    lifecycle(component, event, data) {
        this.log('debug', component, `Lifecycle: ${event}`, data);
    }

    /**
     * Performance logging
     */
    performance(operation, duration, data) {
        const level = duration > 1000 ? 'warning' : 'info';
        this.log(level, 'Performance', `${operation} took ${duration}ms`, data);
    }

    /**
     * Group logging for related operations
     */
    group(title, callback) {
        if (!this.isEnabled()) {
            callback();
            return;
        }

        console.group(`🔖 ${title}`);
        try {
            callback();
        } finally {
            console.groupEnd();
        }
    }

    /**
     * Table logging for structured data
     */
    table(category, data) {
        if (!this.isEnabled()) return;

        console.log(`%c📊 [${this.getTimestamp()}] [${category}]`,
            `color: ${this.colors.info}; font-weight: bold;`);
        console.table(data);
    }

    /**
     * Enable verbose logging
     */
    enable() {
        window.__VERBOSE_LOG__ = true;
        this.success('Logger', 'Verbose logging ENABLED');
    }

    /**
     * Disable verbose logging
     */
    disable() {
        window.__VERBOSE_LOG__ = false;
        console.log('🔇 Verbose logging DISABLED');
    }

    /**
     * Toggle verbose logging
     */
    toggle() {
        if (this.isEnabled()) {
            this.disable();
        } else {
            this.enable();
        }
    }
}

// Create singleton instance
const logger = new Logger();

// Expose to window for easy debugging
if (typeof window !== 'undefined') {
    window.logger = logger;
}

export default logger;
