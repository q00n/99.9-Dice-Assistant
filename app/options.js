function Options(defaults)
{
    this.defaults = defaults || {};

    this.get = function (key, default_value)
    {
        try {
            return JSON.parse(localStorage[key]);
        }
        catch (e) {
            return default_value || this.defaults[key];
        }
    }

    this.set = function (key, value)
    {
        localStorage[key] = JSON.stringify(value);

        return value;
    }

    this.delete = function (key)
    {
        delete localStorage[key];
    }
}
